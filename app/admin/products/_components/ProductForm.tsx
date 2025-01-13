"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"

export function ProductForm({product} : {product?:Product | null}){

    const [price,setPrice] = useState<number|undefined>(product?.price)
    const [error,action] = useFormState(product == null ? addProduct : updateProduct.bind(null,product.id), {})

    return <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input type="number" id="price" name="price" required value={price} onChange={e => setPrice(Number(e.target.value) || undefined)}/>
            <div className="text-muted-foreground">
            {formatCurrency(price||0)}
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" name="desc" required defaultValue={product?.description || ""}/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product==null}/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product==null}/>
        </div>
        
        <SubmitButton/>
        
    </form>
}

function SubmitButton(){
    const {pending} = useFormStatus()
    return <Button type="submit" disabled={pending}>Save</Button>
}