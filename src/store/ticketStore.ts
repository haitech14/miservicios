import type { Ticket } from '../types'

const TICKETS_KEY = 'mi-servicios-tickets'

export function getStoredTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(TICKETS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setStoredTickets(tickets: Ticket[]) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
}

export function addTicket(ticket: Ticket) {
  const tickets = getStoredTickets()
  tickets.unshift(ticket)
  setStoredTickets(tickets)
  return ticket
}
