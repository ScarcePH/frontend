import { useMutation } from "@tanstack/react-query"
import { editPair, type EditPairParam } from "../api"

export const useEditPair = () => useMutation({
    mutationFn:({inventory_id,name,description,category}:EditPairParam)=>editPair({inventory_id,name,description,category})
})
