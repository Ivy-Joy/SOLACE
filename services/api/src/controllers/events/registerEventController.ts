// controllers/register.ts
/*A) Register user for an event (atomic, capacity-aware)
Key points:
Use MongoDB transactions (startSession) if you have a replica set.
Use conditional updates ($inc) and check capacity to avoid overbooking.
If capacity reached, add to waitlist or create registration with status: waitlisted.*/
import mongoose from "mongoose";
import Event from "../models/events/Event";
import Registration from "../models/events/Registration";
import Waitlist from "../models/events/Waitlist";
import AnalyticsEvent from "../models/events/AnalyticsEvent";

export async function registerForEvent({ eventId, memberData, ticketTypeId, source = "web" }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    if (!event) throw new Error("Event not found");

    // find ticket type
    const ticket = event.tickets.id(ticketTypeId);
    if (!ticket) throw new Error("Ticket not found");

    // check capacity per ticket type (if set) or overall capacity
    const ticketCapacity = ticket.capacity || (event.capacity || 0);
    if (ticketCapacity > 0 && ticket.sold >= ticketCapacity) {
      // add to waitlist
      const wl = await Waitlist.create([{ eventId, ...memberData }], { session });
      await AnalyticsEvent.create([{ event: "registration_waitlisted", eventId, actorId: null, props: memberData }], { session });
      await session.commitTransaction();
      return { status: "waitlisted", waitlistId: wl[0]._id };
    }

    // create registration
    const reg = await Registration.create([{
      eventId, ...memberData, ticketTypeId, status: "confirmed", source
    }], { session });

    // increment sold count atomically
    ticket.sold = (ticket.sold || 0) + 1;
    await event.save({ session });

    // analytics
    await AnalyticsEvent.create([{ event: "registration_created", eventId, actorId: reg[0]._id, props: { ticketTypeId } }], { session });

    await session.commitTransaction();
    return { status: "confirmed", registration: reg[0] };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}