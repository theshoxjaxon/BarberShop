import * as React from "react";
import { useState } from "react";

const BARBERS = [
  { id: 1, name: "Sattor" },
  { id: 2, name: "Umid" },
];
const SERVICES = [
  { id: 1, name: "Haircut" },
  { id: 2, name: "Beard Trim" },
];
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const slots = selectedBarber && selectedService && selectedDate
    ? ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!selectedBarber || !selectedService || !selectedDate || !selectedSlot || !name || !phone) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        barberId: selectedBarber,
        serviceId: selectedService,
        date: selectedDate,
        time: selectedSlot,
        notes,
      }),
    });
    if (res.ok) {
      setOpen(false);
    } else {
      const data = await res.json();
      setError(data.error || "Booking failed");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border border-zinc-700 shadow-xl p-8 rounded-lg max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Book a Reservation</DialogTitle>
          <DialogDescription>
            Choose your barber, service, date, and time slot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Barber</label>
    <select
      className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      value={selectedBarber ?? ""}
      onChange={e => setSelectedBarber(Number(e.target.value) || null)}
      required
    >
      <option value="" disabled>Select Barber</option>
      {BARBERS.map(b => (
        <option key={b.id} value={b.id}>{b.name}</option>
      ))}
    </select>
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Service</label>
    <select
      className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      value={selectedService ?? ""}
      onChange={e => setSelectedService(Number(e.target.value) || null)}
      required
    >
      <option value="" disabled>Select Service</option>
      {SERVICES.map(s => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Date</label>
    <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required className="bg-zinc-800 border-zinc-600 text-zinc-100" />
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Time Slot</label>
    <select
      className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      value={selectedSlot}
      onChange={e => setSelectedSlot(e.target.value)}
      required
    >
      <option value="" disabled>Select Time Slot</option>
      {slots.map(slot => (
        <option key={slot} value={slot}>{slot}</option>
      ))}
    </select>
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Your Name</label>
    <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="bg-zinc-800 border-zinc-600 text-zinc-100" />
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Phone</label>
    <Input placeholder="Phone (+1234567890)" value={phone} onChange={e => setPhone(e.target.value)} required className="bg-zinc-800 border-zinc-600 text-zinc-100" />
  </div>
  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-200">Notes (optional)</label>
    <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="bg-zinc-800 border-zinc-600 text-zinc-100" />
  </div>
  {error && <div className="text-red-500 text-sm">{error}</div>}
  <DialogFooter>
    <Button type="submit" disabled={loading} className="bg-yellow-600 hover:bg-yellow-700 text-zinc-900 font-bold">{loading ? "Booking..." : "Book Now"}</Button>
    <DialogClose asChild>
      <Button type="button" variant="secondary">Cancel</Button>
    </DialogClose>
  </DialogFooter>
</form>
      </DialogContent>
    </Dialog>
  );
}
