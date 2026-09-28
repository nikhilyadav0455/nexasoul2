export type Character = {
  id: 'zoro' | 'sanji' | 'luffy';
  name: string;
  title: string;
  bounty: string;
  rank: string;
  image: string;
  accent: string;
};

export const characters: Character[] = [
  {
    id: 'zoro',
    name: 'RORONOA ZORO',
    title: 'THE SWORDSMAN',
    bounty: '1,111,000,000 B',
    rank: 'PIRATE HUNTER',
    image: '/assets/zoro.webp',
    accent: '#43d17b',
  },
  {
    id: 'sanji',
    name: 'VINSMOKE SANJI',
    title: 'THE BLACK LEG',
    bounty: '1,032,000,000 B',
    rank: 'COOK OF THE CREW',
    image: '/assets/sanji.jpeg',
    accent: '#e9b955',
  },
  {
    id: 'luffy',
    name: 'MONKEY D. LUFFY',
    title: 'THE STRAW HAT',
    bounty: '3,000,000,000 B',
    rank: 'CAPTAIN // EMPEROR',
    image: '/assets/luffy.webp',
    accent: '#ef4e49',
  },
];