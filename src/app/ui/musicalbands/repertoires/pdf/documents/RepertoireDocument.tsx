/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Song } from "@/app/lib/definitions";
import { OptionInputSelect } from "@/app/ui/Inputs/CustomSelect";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { Document, Page, Text, StyleSheet, View, Image } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    backgroundColor: "#FFF",
  },
  logo:
  {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
    objectFit: "cover",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  section: {
    backgroundColor: "#262626",
    color: "#FFF",
    marginTop: 10,
    fontSize: 14,
    paddingVertical: 4,
    textAlign: "center",
    textTransform: "uppercase",

  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#262626",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262626",
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    overflow: "hidden",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#1F2937",
    backgroundColor: "#FFF",
    paddingVertical: 6,
    paddingHorizontal: 6,
    textTransform: "uppercase",
    border: '1px solid #d9d9d9);'
  },
  rowCell: {
    fontSize: 11,
    color: "#262626",
    paddingVertical: 6,
    paddingHorizontal: 6,
    border: '1px solid #d9d9d9);',
    flexWrap: "wrap",
    wordBreak: "break-word"
  },
});

export const optionsRepertoireDocument: OptionInputSelect[] = [
  { label: "Todo junto", value: "1" },
  { label: "Separar por género", value: "2" },
  { label: "Separar por artista", value: "3" },
];

export type RepertoireOption = "1" | "2" | "3";

type Props = {
  readonly musicalBandName?: string;
  readonly repertoireName?: string;
  readonly option?: RepertoireOption;
  readonly songs: Song[];
  readonly imageBase64?: string | null;
};

type DocumentOptionProps = Omit<Props, "option">;

export function RepertoireDocument({ option, ...props }: Props) {
  switch (option) {
    case "1":
      return <Option1 {...props} />;
    case "2":
      return <Option2 {...props} />;
    case "3":
      return <Option3 {...props} />;
    default:
      return null;
  }
}

function BaseDocument({
  children,
  musicalBandName,
  repertoireName,
  imageBase64,
}: DocumentOptionProps & { children: React.ReactNode }) {
  return (
    <Document title="Repertorio">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {imageBase64 && <Image style={styles.logo} src={imageBase64} />}
          <Text style={styles.title}>{musicalBandName}</Text>
        </View>

        <Text style={styles.subTitle}>{repertoireName}</Text>

        {children}
      </Page>
    </Document>
  );
}

function SongsTable({
  songs,
  columns,
}: {
  readonly songs: Song[];
  readonly columns: { header: string; render: (song: Song) => React.ReactNode }[];
}) {
  return (
    <View style={styles.tableContainer}>
      <Table>
        <TH>
          {columns.map((col) => (
            <TD key={col.header} style={styles.headerCell}>
              {col.header}
            </TD>
          ))}
        </TH>
        {songs.map((song) => (
          <TR key={song.id}>
            {columns.map((col) => (
              <TD key={col.header} style={styles.rowCell}>
                {col.render(song)}
              </TD>
            ))}
          </TR>
        ))}
      </Table>
    </View>
  );
}

// Opción 1: Todo junto
function Option1(props: DocumentOptionProps) {
  return (
    <BaseDocument {...props}>
      <SongsTable
        songs={props.songs}
        columns={[
          { header: "Nombre", render: (s) => s.name },
          { header: "Artista", render: (s) => s.artist.name },
          { header: "Género", render: (s) => s.genre.name },
          { header: "Tonalidad", render: (s) => s.tonality },
        ]}
      />
    </BaseDocument>
  );
}

// Opción 2: Separar por género
function Option2(props: DocumentOptionProps) {
  const genres = Array.from(new Set(props.songs.map((s) => s.genre.name)));

  return (
    <BaseDocument {...props}>
      {genres.map((genre) => (
        <React.Fragment key={genre}>
          <View style={styles.section}>
            <Text>{genre}</Text>
          </View>
          <SongsTable
            songs={props.songs.filter((s) => s.genre.name === genre)}
            columns={[
              { header: "Nombre", render: (s) => s.name },
              { header: "Artista", render: (s) => s.artist.name },
              { header: "Tonalidad", render: (s) => s.tonality },
            ]}
          />
        </React.Fragment>
      ))}
    </BaseDocument>
  );
}

// Opción 3: Separar por artista
function Option3(props: DocumentOptionProps) {
  const artists = Array.from(new Set(props.songs.map((s) => s.artist.name)));

  return (
    <BaseDocument {...props}>
      {artists.map((artist) => (
        <React.Fragment key={artist}>
          <View style={styles.section}>
            <Text>{artist}</Text>
          </View>
          <SongsTable
            songs={props.songs.filter((s) => s.artist.name === artist)}
            columns={[
              { header: "Nombre", render: (s) => s.name },
              { header: "Género", render: (s) => s.genre.name },
              { header: "Tonalidad", render: (s) => s.tonality },
            ]}
          />
        </React.Fragment>
      ))}
    </BaseDocument>
  );
}