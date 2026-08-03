import { toast } from "sonner";
import api from "./setup";
import type { AddShipmentParams, UpdateOrderParams, VariationParams } from "@/features/admin/types/api";
import type { CustomerObj } from "@/features/admin/types/customer";
import type { ProductCategory } from "@/types/category";

async function 
LoginAPI(email: string, password: string) {
    try {
        const response = await api.post("/auth/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function CheckToken() {
    try {
        const response = await api.get("/auth/validate");
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function GetOrder(status:string, from:string, to:string){
    try {
        const response = await api.get("/orders/get-all?status="+status+"&from="+from+"&to="+to)
        return response.data
    } catch (error) {
        throw error;
    }
}



async function UpdateOrder(payload:UpdateOrderParams){
    try {
        const response = await api.post('/orders/update-status',payload)
        return response.data
    } catch (error) {
        throw error;
    }
}

async function GetAllInventory(){
    try {
        const response = await api.get('/inventory/get-all')
        return response.data
    } catch (error) {
        throw error;
        
    }
}

async function CreatePair(name:string, description:string, category:ProductCategory, file: File|null){
    const formData = new FormData()
    formData.append("file", file as Blob) 
    formData.append("name", name)
    formData.append("description", description)
    formData.append("category", category)
    try {
        const response = await api.post('/inventory/create', formData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        toast.success('Successfully created pair')
        return response.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to add new pair"
        );
        throw error
    }
}

async function CreateVariation(inventory_id:number, variations:VariationParams[]){
    const formData = new FormData();
    formData.append("inventory_id", String(inventory_id));

    const cleanedVariations = variations.map((variation, index) => {
        variation.files?.forEach((file) => {
            formData.append(`images[${index}]`, file);
        });

        const { files, ...rest } = variation;
        return rest;
    });

    formData.append("variations", JSON.stringify(cleanedVariations));
    
    try {
        const response = await api.post('/inventory/create-variation',formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        if(response.data){
            toast.success(response.data.message)
        }
        return response.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to add new pair"
        );
        throw error
    }
}

async function GetDashboardSummary(){
    try {
        const response = await api.get('/dashboard/summary')
        return response.data
    } catch (error) {
         toast.error(
            error instanceof Error ? error.message : "Failed to add new pair"
        );
        throw error
    }
}

async function GetBestSeller(){
    try {
        const response = await api.get('dashboard/bestseller')
        return response.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to add new pair"
        );
        throw error
    }
}

async function GetCustomers(){
    try {
        const response = await api.get('customer/get-all-from-messenger')
        return response.data.customers
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to get customers"
        );
        throw error
    }
}

async function CreateCustomer(payload:CustomerObj){
    try {
        const {id, ...rest} = payload;
        const response = await api.post('customer/create', rest)
        toast.success('Successfully created customer')
        return response.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to create customer"
        );
        throw error
    }
}

async function GetAllAvailablePairs(){
     try {
        const response = await api.get('inventory/get-all-available')
        return response.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to get customers"
        );
        throw error
    }
}

async function CreateOrder(payload:{customer_id:string, inventory_id:number, variation_id:number, status: string, received_amount:string}){
    try {
        const res = await api.post('save-order', payload)
        toast.success('Order created successfully')
        return res.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to get customers"
        );
        throw error
    }
}

async function ChangePassword(new_password:string, password:string ){
    try {
        const res = await api.post('auth/change-password', {new_password, password})
        toast.success('Password changed successfully')
        return res.data
    } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to change password"
        );
        throw error
    }
}

async function AddShipment(payload: AddShipmentParams){
    try {
        const res = await api.post('orders/add-shipment', payload)
        toast.success('Shipment saved successfully')
        return res.data
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : "Failed to save shipment"
        );
        throw error
    }
}
export { 
    LoginAPI, 
    CheckToken,
    UpdateOrder, 
    GetAllInventory, 
    CreatePair,
    CreateVariation,
    GetDashboardSummary,
    GetBestSeller,
    GetOrder,
    GetCustomers,
    GetAllAvailablePairs,
    CreateCustomer,
    CreateOrder,
    ChangePassword,
    AddShipment
};
