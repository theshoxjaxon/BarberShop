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

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/barbers").then(r => r.json()).then(setBarbers);
    fetch("/api/services").then(r => r.json()).then(setServices);
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedService && selectedDate) {
      fetch(`/api/slots?barberId=${selectedBarber}&date=${selectedDate}&serviceId=${selectedService}`)
        .then(r => r.json())
        .then(setSlots);
    } else {
      setSlots([]);
    }
  }, [selectedBarber, selectedService, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Reservation</DialogTitle>
          <DialogDescription>
            Choose your barber, service, date, and time slot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={selectedBarber !== null ? String(selectedBarber) : ""} onValueChange={v => setSelectedBarber(Number(v))} required>
            <option value="" disabled>Select Barber</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
          <Select value={selectedService !== null ? String(selectedService) : ""} onValueChange={v => setSelectedService(Number(v))} required>
            <option value="" disabled>Select Service</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required />
          <Select value={selectedSlot} onValueChange={setSelectedSlot} required>
            <option value="" disabled>Select Time Slot</option>
            {slots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </Select>
          <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input placeholder="Phone (+1234567890)" value={phone} onChange={e => setPhone(e.target.value)} required />
          <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
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
