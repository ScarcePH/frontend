import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { GetAllInventory } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { formatPeso } from '@/utils/dashboard'
import type { InventoryObj } from '../../types/Inventory'
import type { Promotion, PromotionPayload, PromotionStatus } from '../../types/promotion'
import {
  useCreatePromotion,
  useDeletePromotion,
  useEndPromotion,
  usePromotions,
  useUpdatePromotion,
} from '../../hooks/usePromotions'

const statusLabels: Record<PromotionStatus, string> = {
  scheduled: 'Scheduled',
  active: 'Active',
  ended: 'Ended',
}

function getManilaDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to save promotion'
}

function PromotionForm({ promotion, onSaved }: { promotion?: Promotion; onSaved: () => void }) {
  const inventory = useQuery<InventoryObj[]>({ queryKey: ['inventory'], queryFn: GetAllInventory })
  const createMutation = useCreatePromotion()
  const updateMutation = useUpdatePromotion()
  const [name, setName] = useState(promotion?.name ?? '')
  const [description, setDescription] = useState(promotion?.description ?? '')
  const [startDate, setStartDate] = useState(promotion?.start_date ?? getManilaDate())
  const [endDate, setEndDate] = useState(promotion?.end_date ?? getManilaDate())
  const [search, setSearch] = useState('')
  const [prices, setPrices] = useState<Record<number, string>>(() => Object.fromEntries(
    promotion?.items.map((item) => [item.variation_id, String(item.promo_price)]) ?? [],
  ))
  const [error, setError] = useState('')
  const pending = createMutation.isPending || updateMutation.isPending
  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return inventory.data ?? []
    return (inventory.data ?? []).filter((pair) => `${pair.name} ${pair.description}`.toLowerCase().includes(query))
  }, [inventory.data, search])

  const toggleVariation = (variationId: number) => {
    setPrices((current) => {
      const next = { ...current }
      if (variationId in next) delete next[variationId]
      else next[variationId] = ''
      return next
    })
  }

  const handleSubmit = async () => {
    setError('')
    if (!name.trim() || !description.trim()) return setError('Name and description are required.')
    if (!startDate || !endDate || endDate < startDate) return setError('Choose a valid inclusive date range.')
    const selected = Object.entries(prices)
    if (!selected.length) return setError('Select at least one variation.')

    const regularPrices = new Map(
      (inventory.data ?? []).flatMap((pair) => pair.variations.map((variation) => [variation.id, variation.price] as const)),
    )
    for (const [variationId, rawPrice] of selected) {
      const price = Number(rawPrice)
      const regularPrice = regularPrices.get(Number(variationId))
      if (!Number.isFinite(price) || price <= 0 || !regularPrice || price >= regularPrice || !/^\d+(?:\.\d{1,2})?$/.test(rawPrice)) {
        return setError(`Enter a positive price below regular price, with up to two decimals, for variation ${variationId}.`)
      }
    }
    const payload: PromotionPayload = {
      name: name.trim(),
      description: description.trim(),
      start_date: startDate,
      end_date: endDate,
      items: selected.map(([variationId, promoPrice]) => ({
        variation_id: Number(variationId),
        promo_price: Number(promoPrice),
      })),
    }
    try {
      if (promotion) await updateMutation.mutateAsync({ id: promotion.id, payload })
      else await createMutation.mutateAsync(payload)
      toast.success(promotion ? 'Promotion updated' : 'Promotion scheduled')
      onSaved()
    } catch (mutationError) {
      setError(getErrorMessage(mutationError))
    }
  }

  return (
    <div className="flex max-h-[82dvh] flex-col gap-5 overflow-y-auto pr-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm sm:col-span-2">Name<Input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="grid gap-2 text-sm sm:col-span-2">Description<Textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="grid gap-2 text-sm">Start date<Input type="date" min={getManilaDate()} value={startDate} disabled={promotion?.status === 'active'} onChange={(event) => setStartDate(event.target.value)} /></label>
        <label className="grid gap-2 text-sm">End date<Input type="date" min={promotion?.status === 'active' ? getManilaDate() : startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
      </div>

      <div>
        <p className="text-sm font-medium">Promotional variations</p>
        <label className="relative mt-2 block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="pl-9" />
        </label>
      </div>

      <div className="space-y-3">
        {inventory.isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading variations…</div> : null}
        {filteredInventory.map((pair) => (
          <section key={pair.id} className="rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <img src={pair.image} alt="" className="size-12 rounded border bg-muted object-contain" />
              <div><h3 className="text-sm font-semibold">{pair.name}</h3><p className="text-xs text-muted-foreground">{pair.variations.length} variations</p></div>
            </div>
            <div className="mt-3 space-y-2 border-t pt-3">
              {pair.variations.map((variation) => {
                const selected = variation.id in prices
                return (
                  <div key={variation.id} className="grid grid-cols-[auto_1fr_minmax(7rem,0.55fr)] items-center gap-3 text-sm">
                    <input type="checkbox" checked={selected} onChange={() => toggleVariation(variation.id)} aria-label={`Select ${pair.name}, size ${variation.size}`} className="size-4 accent-primary" />
                    <div><p>US {variation.size} · {variation.condition}</p><p className="text-xs text-muted-foreground">Regular {formatPeso(variation.price)}</p></div>
                    <Input type="number" min="0.01" step="0.01" max={variation.price - 0.01} value={prices[variation.id] ?? ''} disabled={!selected} onChange={(event) => setPrices((current) => ({ ...current, [variation.id]: event.target.value }))} placeholder="Promo price" aria-label={`Promotional price for ${pair.name}, size ${variation.size}`} />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {error ? <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}
      <Button onClick={handleSubmit} disabled={pending || inventory.isLoading}>{pending ? <Spinner /> : null}{promotion ? 'Save changes' : 'Schedule promotion'}</Button>
    </div>
  )
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const [editOpen, setEditOpen] = useState(false)
  const endMutation = useEndPromotion()
  const deleteMutation = useDeletePromotion()

  const endNow = async () => {
    if (!window.confirm(`End “${promotion.name}” now? Customers will immediately return to regular prices.`)) return
    try {
      await endMutation.mutateAsync(promotion.id)
      toast.success('Promotion ended')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete scheduled promotion “${promotion.name}”?`)) return
    try {
      await deleteMutation.mutateAsync(promotion.id)
      toast.success('Promotion deleted')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><Badge variant={promotion.status === 'active' ? 'default' : 'secondary'}>{statusLabels[promotion.status]}</Badge><h3 className="mt-3 text-lg font-semibold">{promotion.name}</h3><p className="mt-1 text-sm text-muted-foreground">{promotion.description}</p></div>
        <div className="flex gap-2">
          {promotion.status !== 'ended' ? (
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild><Button variant="outline" size="sm"><Pencil /> Edit</Button></DialogTrigger>
              <DialogContent className="max-w-3xl"><DialogTitle>Edit promotion</DialogTitle><DialogDescription>Update promotion details, dates, variations, and prices.</DialogDescription><PromotionForm promotion={promotion} onSaved={() => setEditOpen(false)} /></DialogContent>
            </Dialog>
          ) : null}
          {promotion.status === 'active' ? <Button variant="destructive" size="sm" onClick={endNow} disabled={endMutation.isPending}>End now</Button> : null}
          {promotion.status === 'scheduled' ? <Button variant="ghost" size="icon" onClick={remove} disabled={deleteMutation.isPending} aria-label={`Delete ${promotion.name}`}><Trash2 /></Button> : null}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-2"><CalendarDays className="size-4" />{promotion.start_date} — {promotion.end_date}</span><span>{promotion.items.length} promotional {promotion.items.length === 1 ? 'variation' : 'variations'}</span></div>
      <div className="mt-3 flex flex-wrap gap-2">{promotion.items.slice(0, 6).map((item) => <Badge key={item.id} variant="outline">{item.inventory_name} · US {item.size} · {formatPeso(item.promo_price)}</Badge>)}</div>
    </article>
  )
}

export default function Promotions() {
  const promotions = usePromotions()
  const [createOpen, setCreateOpen] = useState(false)
  const grouped = useMemo(() => ({
    scheduled: promotions.data?.filter((promotion) => promotion.status === 'scheduled') ?? [],
    active: promotions.data?.filter((promotion) => promotion.status === 'active') ?? [],
    ended: promotions.data?.filter((promotion) => promotion.status === 'ended') ?? [],
  }), [promotions.data])

  return (
    <main className="h-full overflow-y-auto px-6 pb-12">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/90 py-5 backdrop-blur">
        <div><p className="text-sm text-muted-foreground">Pricing calendar</p><h1 className="text-2xl font-semibold">Promotions</h1></div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button><Plus /> New promotion</Button></DialogTrigger>
          <DialogContent className="max-w-3xl"><DialogTitle>Schedule promotion</DialogTitle><DialogDescription>Choose an inclusive Manila-time date range and discounted variations.</DialogDescription><PromotionForm onSaved={() => setCreateOpen(false)} /></DialogContent>
        </Dialog>
      </header>

      {promotions.isLoading ? <div className="flex min-h-64 items-center justify-center gap-2 text-muted-foreground"><Spinner /> Loading promotions…</div> : null}
      {promotions.isError ? <div className="mt-6 rounded-lg border border-destructive/40 p-5 text-destructive">Unable to load promotions. <Button variant="outline" size="sm" onClick={() => promotions.refetch()}>Try again</Button></div> : null}
      {!promotions.isLoading && !promotions.isError ? (
        <div className="space-y-10 py-8">
          {(['active', 'scheduled', 'ended'] as PromotionStatus[]).map((status) => (
            <section key={status}>
              <div className="mb-4 flex items-center gap-3"><Tag className="size-4" /><h2 className="font-semibold">{statusLabels[status]}</h2><span className="text-sm text-muted-foreground">{grouped[status].length}</span></div>
              {grouped[status].length ? <div className="grid gap-4 xl:grid-cols-2">{grouped[status].map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />)}</div> : <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">No {statusLabels[status].toLowerCase()} promotions.</p>}
            </section>
          ))}
        </div>
      ) : null}
    </main>
  )
}
