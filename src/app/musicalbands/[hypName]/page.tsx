import { Metadata } from 'next';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import MainMenu from '@/app/ui/musicalbands/MainMenu';

type Props = {
  params: Promise<{ hypName: string; }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const hypName = (await params).hypName

  return {
    title: `Menú principal :: ${hypName}`,
    description: 'Banda musical',
  };
}

export default async function MusicalBandPage(props: Props) {
  const hypName = (await props.params).hypName;
  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <main>
      {musicalBand && <MainMenu hypName={hypName} musicalBandId={musicalBand.id} />}
    </main>
  );
}
