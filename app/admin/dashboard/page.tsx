import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteButton } from "./delete-button";

export default async function AdminDashboardPage() {
  const [
    totalCars,
    featuredCars,
    availableCars,
    vehicles,
    contactCount,
    financeCount,
    tradeInCount,
    appointmentCount,
    carFinderCount,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { featured: true } }),
    prisma.vehicle.count({ where: { status: "available" } }),
    prisma.vehicle.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.contactSubmission.count(),
    prisma.financeApplication.count(),
    prisma.tradeInSubmission.count(),
    prisma.appointment.count(),
    prisma.carFinderRequest.count(),
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gradient-gold">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/admin/settings">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Site Settings</Button>
            </Link>
            <Link href="/admin/cars/new">
              <Button className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]">Add New Vehicle</Button>
            </Link>
          </div>
        </div>

        {/* Vehicle Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#C0A66A]">{totalCars}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Featured Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#C0A66A]">{featuredCars}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Available Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#C0A66A]">{availableCars}</p>
            </CardContent>
          </Card>
        </div>

        {/* Submission Stats */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Submissions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Contact</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{contactCount}</p>
                <Link href="/admin/submissions?tab=contact">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Finance Apps</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{financeCount}</p>
                <Link href="/admin/submissions?tab=finance">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Trade-Ins</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{tradeInCount}</p>
                <Link href="/admin/submissions?tab=tradein">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Appointments</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{appointmentCount}</p>
                <Link href="/admin/submissions?tab=appointments">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Car Finder</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{carFinderCount}</p>
                <Link href="/admin/submissions?tab=carfinder">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">View</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vehicles Table */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Inventory</h2>
          <div className="bg-[#111] border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="border-white/10">
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.status === "available"
                            ? "default"
                            : vehicle.status === "sold"
                            ? "destructive"
                            : "secondary"
                        }
                        className={vehicle.status === "available" ? "bg-green-600" : undefined}
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.featured ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/cars/${vehicle.id}/edit`}>
                          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                            Edit
                          </Button>
                        </Link>
                        <DeleteButton id={vehicle.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {vehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
