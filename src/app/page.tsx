import { MusicalBand } from './lib/definitions';
import { getMusicalBandsByUser } from './lib/api/musicalBands';
import MainContent from './ui/home/MainContent';
import HomeHeader from './ui/home/HomeHeader';

export default async function Home() {
  const musicalBands: MusicalBand[] = await getMusicalBandsByUser();

  return (
    <div>
      <HomeHeader />
      <MainContent musicalBands={musicalBands} />
    </div>
  );
}
