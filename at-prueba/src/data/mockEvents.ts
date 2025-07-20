import { SportEvent } from '@/types/betting';

export const mockEvents: SportEvent[] = [
  {
    id: '1',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    sport: 'Fútbol',
    date: '2024-07-20',
    time: '16:00',
    homeOdds: 2.1,
    awayOdds: 3.2,
    drawOdds: 3.5,
    status: 'upcoming'
  },
  {
    id: '2',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    sport: 'Fútbol',
    date: '2024-07-21',
    time: '14:30',
    homeOdds: 2.8,
    awayOdds: 2.4,
    drawOdds: 3.1,
    status: 'upcoming'
  },
  {
    id: '3',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    sport: 'Baloncesto',
    date: '2024-07-22',
    time: '21:00',
    homeOdds: 1.9,
    awayOdds: 1.8,
    status: 'upcoming'
  },
  {
    id: '4',
    homeTeam: 'Inter Miami',
    awayTeam: 'LA Galaxy',
    sport: 'Fútbol',
    date: '2024-07-19',
    time: '20:00',
    homeOdds: 2.5,
    awayOdds: 2.9,
    drawOdds: 3.0,
    status: 'live'
  },
  {
    id: '5',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Miami Heat',
    sport: 'Baloncesto',
    date: '2024-07-23',
    time: '19:30',
    homeOdds: 1.7,
    awayOdds: 2.1,
    status: 'upcoming'
  },
  {
    id: '6',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Valencia',
    sport: 'Fútbol',
    date: '2024-07-24',
    time: '18:00',
    homeOdds: 1.6,
    awayOdds: 4.2,
    drawOdds: 3.8,
    status: 'upcoming'
  }
];