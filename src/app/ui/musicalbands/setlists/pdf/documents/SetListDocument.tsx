/* eslint-disable jsx-a11y/alt-text */
"use client";

import { SetlistDetails } from "@/app/lib/definitions";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#262626",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 14,
    borderRadius: 26,
    objectFit: "cover",
  },
  bandName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    color: "#525252",
    marginBottom: 14,
  },
  set: {
    marginTop: 10,
    marginBottom: 4,
    padding: 7,
    backgroundColor: "#262626",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  songHeader: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
    fontWeight: "bold",
  },
  songRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  order: { width: "8%" },
  songName: { width: "28%" },
  artist: { width: "23%" },
  tonality: { width: "13%" },
  notes: { width: "28%" },
});

type Props = {
  readonly musicalBandName?: string;
  readonly setlistDetails: SetlistDetails;
  readonly imageBase64?: string | null;
};

export function SetListDocument({ musicalBandName, setlistDetails, imageBase64 }: Props) {
  const sets = [...setlistDetails.sets].sort((a, b) => a.set.orderIndex - b.set.orderIndex);

  return (
    <Document title={setlistDetails.setList.name}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          {imageBase64 && <Image style={styles.logo} src={imageBase64} />}
          <Text style={styles.bandName}>{musicalBandName}</Text>
        </View>

        <Text style={styles.title}>{setlistDetails.setList.name}</Text>
        {setlistDetails.setList.description && (
          <Text style={styles.description}>{setlistDetails.setList.description}</Text>
        )}

        {sets.map(({ set, songs }) => (
          <View key={set.id.toString()} wrap={false}>
            <Text style={styles.set}>{set.name}</Text>
            <View style={styles.songHeader}>
              <Text style={styles.order}>Orden</Text>
              <Text style={styles.songName}>Canción</Text>
              <Text style={styles.artist}>Artista</Text>
              <Text style={styles.tonality}>Tonalidad</Text>
              <Text style={styles.notes}>Notas</Text>
            </View>
            {[...songs].sort((a, b) => a.orderIndex - b.orderIndex).map(({ id, orderIndex, song, notes }) => (
              <View key={id.toString()} style={styles.songRow}>
                <Text style={styles.order}>{orderIndex}</Text>
                <Text style={styles.songName}>{song.name}</Text>
                <Text style={styles.artist}>{song.artist?.name}</Text>
                <Text style={styles.tonality}>{song.tonality}</Text>
                <Text style={styles.notes}>{notes}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}