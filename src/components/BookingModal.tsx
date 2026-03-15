import * as React from "react";
import { useState, useEffect } from "react";
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
import { Select } from "./ui/select";

interface Barber {
  id: number;
  name: string;
}
interface Service {
  id: number;
  name: string;
  durationMinutes: number;
}

// Custom dark select component for consistent styling
function DarkSelect({ value, onChange, children, ...props }: any) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      {...props}
    >
      {children}
    </select>
  );
}

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    barberId: "",
    serviceId: "",
    date: "",
    startTime: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/barbers").then(r => r.json()).then(setBarbers);
      fetch("/api/services").then(r => r.json()).then(setServices);
    }
  }, [open]);

  useEffect(() => {
    if (formData.barberId && formData.serviceId && formData.date) {
      fetch(`/api/slots?barberId=${formData.barberId}&date=${formData.date}&serviceId=${formData.serviceId}`)
        .then(r => r.json())
        .then(setSlots);
    } else {
      setSlots([]);
    }
  }, [formData.barberId, formData.serviceId, formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        barberId: Number(formData.barberId),
        serviceId: Number(formData.serviceId),
        date: formData.date,
        time: formData.startTime,
        notes: formData.notes,
      }),
    });
    if (res.status === 409) {
      setError("This slot was just taken!");
    } else if (res.ok) {
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
      <DialogContent className="bg-zinc-900 text-white border border-zinc-700 shadow-xl p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Book a Reservation</DialogTitle>
          <DialogDescription>
            Choose your barber, service, date, and time slot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Barber</label>
            <DarkSelect name="barberId" value={formData.barberId} onChange={handleChange} required>
              <option value="" disabled>Select Barber</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </DarkSelect>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Service</label>
            <DarkSelect name="serviceId" value={formData.serviceId} onChange={handleChange} required>
              <option value="" disabled>Select Service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </DarkSelect>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Time Slot</label>
            <DarkSelect name="startTime" value={formData.startTime} onChange={handleChange} required>
              <option value="" disabled>Select Time Slot</option>
              {slots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </DarkSelect>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input name="clientName" placeholder="Your Name" value={formData.clientName} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input name="clientPhone" placeholder="Phone (+1234567890)" value={formData.clientPhone} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Notes</label>
            <input name="notes" placeholder="Notes (optional)" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Booking..." : "Book Now"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
