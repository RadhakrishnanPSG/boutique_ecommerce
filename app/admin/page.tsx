import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"

function wait(duration:number){
    return new Promise(resolve => setTimeout(resolve,duration))
}

async function getSalesData(){
    const data = await db.order.aggregate(
        {
            _sum: {pricePaid:true},
            _count:true
        }
    )

    await wait(2000)

    return {
        amount:data._sum.pricePaid || 0,
        numberOfSales: data._count
    }
}

async function getUserData() {

    const [userCount,orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum:{pricePaid:true}
        })
    ])

    return {
        userCount,
        averageValuePerUser : userCount === 0 ? 0 : (orderData._sum.pricePaid || 0)/userCount
    }
}

async function getProductData() {
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({where:{isAvailableForPurchase:true}}),
        db.product.count({where:{isAvailableForPurchase:false}})
    ])

    return {activeCount,inactiveCount}
}

export default async function AdminDashboard(){

    const [salesData,userData,productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashBoardCard title="Sales" 
            subtitle={`${formatNumber(salesData.numberOfSales)} orders`} body={formatCurrency(salesData.amount)}/>

            <DashBoardCard title="Customer" 
            subtitle={`${formatCurrency(userData.averageValuePerUser)} Average`} body={formatNumber(userData.userCount)}/>

            <DashBoardCard title="Active Products" 
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive products`} body={formatNumber(productData.activeCount)}/>
        </div>
    )
}

type DashBoardCardProps = {
    title: string
    subtitle : string
    body : string
}

function DashBoardCard({title,subtitle,body}:DashBoardCardProps){
    return <Card>
    <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent>
        <p>{body}</p>
    </CardContent>
    </Card>
}