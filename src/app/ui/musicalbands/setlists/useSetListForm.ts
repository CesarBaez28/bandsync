import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { UUID } from 'node:crypto';
import { OptionInputSelect } from '@/ui/inputs/CustomSelect';
import { handleAsync } from '@/app/lib/utils';
import { getRepertoireSongs } from '@/app/lib/api/repertoires';
import { ApiResponse, Song } from '@/app/lib/definitions';

export type SongItem = Song & { uid: string; setSongId?: UUID; index: number; notes?: string };

export type SetSongs = {
  uid: string;
  id?: UUID;
  name: string;
  index: number;
  songs: SongItem[];
};

const normalizeSongIndexes = (songs: SongItem[]) =>
  songs.map((song, idx) => ({ ...song, index: idx + 1 }));

const normalizeSetIndexes = (sets: SetSongs[]) =>
  sets.map((set, idx) => ({ ...set, index: idx + 1 }));

const fetchSongs = async (
  repertoireId: UUID,
  musicalBandId: UUID | undefined,
  setSongsOptions: Dispatch<SetStateAction<OptionInputSelect[]>>,
  setSongs: Dispatch<SetStateAction<Song[]>>
) => {
  const [songs, error] = await handleAsync<ApiResponse<Song[]>>(
    getRepertoireSongs({ repertoireId, musicalBandId })
  );

  if (!error && songs.data) {
    setSongsOptions(
      songs.data.map((song: Song) => ({ label: song.name, value: song.id.toString() }))
    );
    setSongs(songs.data);
  }
};

export function useSetListForm({
  musicalBandId,
  selectedRepertoire,
  initialSets = [],
}: {
  musicalBandId: UUID | undefined;
  selectedRepertoire: string | undefined;
  initialSets?: SetSongs[];
}) {
  const [songOptions, setSongOptions] = useState<OptionInputSelect[]>([]);
  const [selectedSong, setSelectedSong] = useState<string>('');
  const [setName, setSetName] = useState<string>('');
  const [newSets, setNewSets] = useState<SetSongs[]>(initialSets);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SongItem[]>([]);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [activeSelectedSongId, setActiveSelectedSongId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingSetUid, setEditingSetUid] = useState<string | null>(null);

  useEffect(() => {
    setNewSets(initialSets);
  }, [initialSets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const activeSet = activeSetId ? newSets.find((set) => set.uid === activeSetId) : null;
  const activeSetIndex = activeSet ? newSets.findIndex((set) => set.uid === activeSetId) : -1;
  const activeSelectedSong = activeSelectedSongId
    ? selectedSongs.find((song) => song.uid === activeSelectedSongId)
    : null;
  const activeSelectedSongIndex = activeSelectedSong
    ? selectedSongs.findIndex((song) => song.uid === activeSelectedSongId)
    : -1;

  useEffect(() => {
    if (!selectedRepertoire) {
      setSongOptions([]);
      return;
    }

    fetchSongs(selectedRepertoire as UUID, musicalBandId, setSongOptions, setSongs);
  }, [selectedRepertoire, musicalBandId]);

  const handleOpenModal = () => {
    setEditingSetUid(null);
    setOpenModal(true);
  };

  const handleCancelModal = () => {
    setOpenModal(false);
    setSetName('');
    setSelectedSong('');
    setSelectedSongs([]);
    setEditingSetUid(null);
  };

  const resetModalState = () => {
    setSetName('');
    setSelectedSongs([]);
    setSelectedSong('');
    setEditingSetUid(null);
    setOpenModal(false);
  };

  const handleDragStartSets = ({ active }: DragStartEvent) => {
    setActiveSetId(active.id as string);
  };

  const handleDragEndSets = ({ active, over }: DragEndEvent) => {
    setActiveSetId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = newSets.findIndex((s) => s.uid === active.id);
    const newIndex = newSets.findIndex((s) => s.uid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setNewSets((prev) => normalizeSetIndexes(arrayMove(prev, oldIndex, newIndex)));
  };

  const handleDragStartSelectedSongs = ({ active }: DragStartEvent) => {
    setActiveSelectedSongId(active.id as string);
  };

  const saveSet = (sets: SetSongs[]) =>
    normalizeSetIndexes(
      sets.map((set) => ({
        ...set,
        songs: set.songs.map((song) => ({ ...song })),
      }))
    );

  const handleSaveSet = () => {
    if (!setName) return;

    const nextSets = editingSetUid
      ? newSets.map((set) =>
          set.uid === editingSetUid ? { ...set, name: setName, songs: selectedSongs } : set
        )
      : [...newSets, { uid: crypto.randomUUID(), name: setName, songs: selectedSongs, index: newSets.length + 1 }];

    setNewSets(() => saveSet(nextSets));
    resetModalState();
  };

  const handleDeleteSet = (uid: string) => {
    setNewSets((prev) => normalizeSetIndexes(prev.filter((s) => s.uid !== uid)));
  };

  const handleSetSongsReorder = (setUid: string, songs: SongItem[]) => {
    setNewSets((prev) =>
      normalizeSetIndexes(
        prev.map((set) => (set.uid === setUid ? { ...set, songs: normalizeSongIndexes(songs) } : set))
      )
    );
  };

  const handleEditSet = (uid: string) => {
    const setToEdit = newSets.find((set) => set.uid === uid);
    if (!setToEdit) return;

    setSetName(setToEdit.name);
    setSelectedSongs(setToEdit.songs.map((song) => ({ ...song })));
    setSelectedSong('');
    setEditingSetUid(uid);
    setOpenModal(true);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = selectedSongs.findIndex((song) => song.uid === active.id);
    const newIndex = selectedSongs.findIndex((song) => song.uid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setSelectedSongs((prev) => normalizeSongIndexes(arrayMove(prev, oldIndex, newIndex)));
  };

  const handleAddSong = () => {
    const songToAdd = songs.find((song) => song.id.toString() === selectedSong);
    if (songToAdd) {
      setSelectedSongs((prev) =>
        normalizeSongIndexes([
          ...prev,
          { ...songToAdd, uid: crypto.randomUUID(), index: prev.length + 1, notes: '' },
        ])
      );
    }
  };

  const handleDeleteSong = (songId: string) => {
    setSelectedSongs((prev) => normalizeSongIndexes(prev.filter((s) => s.uid !== songId)));
  };

  const handleSongNotesChange = (songId: string, notes: string) => {
    setSelectedSongs((prev) =>
      normalizeSongIndexes(prev.map((song) => (song.uid === songId ? { ...song, notes } : song)))
    );
  };

  const removeSongFromSet = (set: SetSongs, songId: string) => {
    const songs = set.songs.filter((song) => song.uid !== songId);
    return { ...set, songs: normalizeSongIndexes(songs) };
  };

  const handleDeleteSongFromSet = (setId: string, songId: string) => {
    setNewSets((prev) => prev.map((set) => (set.uid === setId ? removeSongFromSet(set, songId) : set)));
  };

  return {
    songOptions,
    selectedSong,
    setSelectedSong,
    setName,
    setSetName,
    newSets,
    songs,
    selectedSongs,
    activeSet,
    activeSetIndex,
    activeSelectedSong,
    activeSelectedSongIndex,
    openModal,
    editingSetUid,
    sensors,
    handleOpenModal,
    handleCancelModal,
    handleDragStartSets,
    handleDragEndSets,
    handleDragStartSelectedSongs,
    handleSaveSet,
    handleDeleteSet,
    handleSetSongsReorder,
    handleEditSet,
    handleDragEnd,
    handleAddSong,
    handleDeleteSong,
    handleSongNotesChange,
    handleDeleteSongFromSet,
  };
}
