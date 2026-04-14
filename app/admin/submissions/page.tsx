"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
}

interface FinanceApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  income: number | null;
  vehicleId: string | null;
  tradeIn: boolean;
  createdAt: string;
}

interface TradeInSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  photos: string | null;
  videos: string | null;
  createdAt: string;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface CarFinderRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  make: string | null;
  model: string | null;
  minYear: number | null;
  maxYear: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  bodyStyle: string | null;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [finance, setFinance] = useState<FinanceApplication[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeInSubmission[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [carFinders, setCarFinders] = useState<CarFinderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [cRes, fRes, tRes, aRes, cfRes] = await Promise.all([
          fetch("/api/admin/submissions?type=contact"),
          fetch("/api/admin/submissions?type=finance"),
          fetch("/api/admin/submissions?type=tradein"),
          fetch("/api/admin/submissions?type=appointments"),
          fetch("/api/admin/submissions?type=carfinder"),
        ]);
        if (cRes.ok) setContacts(await cRes.json());
        if (fRes.ok) setFinance(await fRes.json());
        if (tRes.ok) setTradeIns(await tRes.json());
        if (aRes.ok) setAppointments(await aRes.json());
        if (cfRes.ok) setCarFinders(await cfRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient-gold">Submissions</h1>
          <Link href="/admin/dashboard">
            <span className="text-sm text-white/60 hover:text-[#C0A66A] transition-colors">&larr; Back to Dashboard</span>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#111] border border-white/10 mb-6">
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black">
              Contact ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black">
              Finance ({finance.length})
            </TabsTrigger>
            <TabsTrigger value="tradein" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black">
              Trade-Ins ({tradeIns.length})
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black">
              Appointments ({appointments.length})
            </TabsTrigger>
            <TabsTrigger value="carfinder" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black">
              Car Finder ({carFinders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone || "—"}</TableCell>
                      <TableCell>{item.subject || "—"}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {contacts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No contact submissions.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="finance">
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Trade-In</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finance.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.income ? `$${item.income.toLocaleString()}` : "—"}</TableCell>
                      <TableCell>
                        <Badge className={item.tradeIn ? "bg-[#C0A66A] text-black" : "bg-white/10 text-white"}>
                          {item.tradeIn ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {finance.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No finance applications.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tradein">
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Photos</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeIns.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>{item.firstName} {item.lastName}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.year} {item.make} {item.model}</TableCell>
                      <TableCell>{item.mileage}</TableCell>
                      <TableCell>
                        {(item.photos || item.videos) ? (
                          <div className="flex flex-wrap gap-2 max-w-xs">
                            {(() => {
                              const photoList: string[] = [];
                              const videoList: string[] = [];
                              try {
                                if (item.photos) photoList.push(...JSON.parse(item.photos));
                              } catch {
                                if (item.photos) photoList.push(...item.photos.split("||BASE64||"));
                              }
                              try {
                                if (item.videos) videoList.push(...JSON.parse(item.videos));
                              } catch {}
                              return (
                                <>
                                  {photoList.map((src, i) => (
                                    <a key={`img-${i}`} href={src} target="_blank" rel="noreferrer">
                                      <img src={src} alt={`photo-${i}`} className="h-12 w-12 object-cover border border-white/10 hover:border-[#C0A66A] transition-colors" />
                                    </a>
                                  ))}
                                  {videoList.map((src, i) => (
                                    <a key={`vid-${i}`} href={src} target="_blank" rel="noreferrer" className="h-12 px-2 flex items-center justify-center bg-[#111] border border-white/10 text-[10px] text-white/70 hover:border-[#C0A66A] transition-colors">
                                      Video {i + 1}
                                    </a>
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {tradeIns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No trade-in submissions.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No appointments.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="carfinder">
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Preferences</TableHead>
                    <TableHead>Year Range</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carFinders.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone || "—"}</TableCell>
                      <TableCell>{[item.make, item.model, item.bodyStyle].filter(Boolean).join(" ") || "—"}</TableCell>
                      <TableCell>{item.minYear || "—"} - {item.maxYear || "—"}</TableCell>
                      <TableCell>{item.minPrice ? `$${item.minPrice.toLocaleString()}` : "—"} - {item.maxPrice ? `$${item.maxPrice.toLocaleString()}` : "—"}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {carFinders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No Car Finder requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
