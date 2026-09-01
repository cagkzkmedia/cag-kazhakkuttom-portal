import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSong, deleteSong, getSongs, updateSong } from '../../services/songService.firebase';
import './SongManagement.css';

const initialFormState = {
  title: '',
  tempo: 'slow',
  timeSignature: '4/4',
  scaleType: 'major',
  scaleKey: 'C',
  notes: '',
};

const scaleTypeOptions = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
];

const majorScaleOptions = [
  { value: 'C', label: 'C' },
  { value: 'G', label: 'G' },
  { value: 'D', label: 'D' },
  { value: 'A', label: 'A' },
  { value: 'E', label: 'E' },
  { value: 'B', label: 'B' },
  { value: 'F#', label: 'F#' },
  { value: 'C#', label: 'C#' },
  { value: 'F', label: 'F' },
  { value: 'Bb', label: 'Bb' },
  { value: 'Eb', label: 'Eb' },
  { value: 'Ab', label: 'Ab' },
];

const minorScaleOptions = [
  { value: 'A', label: 'A' },
  { value: 'E', label: 'E' },
  { value: 'B', label: 'B' },
  { value: 'F#', label: 'F#' },
  { value: 'C#', label: 'C#' },
  { value: 'G#', label: 'G#' },
  { value: 'D', label: 'D' },
  { value: 'G', label: 'G' },
  { value: 'C', label: 'C' },
  { value: 'F', label: 'F' },
  { value: 'Bb', label: 'Bb' },
  { value: 'Eb', label: 'Eb' },
];

const getScaleOptions = (scaleType) => (scaleType === 'minor' ? minorScaleOptions : majorScaleOptions);

const normalizeText = (value = '') => value.toString().trim().toLowerCase();

const SongManagement = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [tempoFilter, setTempoFilter] = useState('all');
  const [timeSignatureFilter, setTimeSignatureFilter] = useState('all');
  const [scaleTypeFilter, setScaleTypeFilter] = useState('all');
  const [scaleKeyFilter, setScaleKeyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSongForm, setShowNewSongForm] = useState(false);

  const currentScaleOptions = getScaleOptions(formData.scaleType);
  const currentFilterScaleOptions = getScaleOptions(scaleTypeFilter === 'all' ? 'major' : scaleTypeFilter);

  const popularTimeSignatures = [
    '4/4',
    '3/4',
    '6/8',
    '2/4',
    '12/8',
    '5/4',
  ];

  const [editingSongId, setEditingSongId] = useState(null);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setErrorMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      const data = await getSongs();
      setSongs(data);
    } catch (error) {
      console.error('Error loading songs:', error);
      setErrorMessage('Failed to load songs.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSongs = useMemo(() => {
    const query = normalizeText(searchQuery);

    return songs.filter((song) => {
      const songScaleValue = song.scale || 'major-C';
      const [songScaleType, songScaleKey] = songScaleValue.split('-');
      const matchesTempo = tempoFilter === 'all' || normalizeText(song.tempo) === tempoFilter;
      const matchesScaleType = scaleTypeFilter === 'all' || normalizeText(songScaleType) === scaleTypeFilter;
      const matchesScaleKey =
        scaleKeyFilter === 'all' || normalizeText(songScaleKey || songScaleType) === normalizeText(scaleKeyFilter);
      const matchesTimeSignature =
        timeSignatureFilter === 'all' || (song.timeSignature || '4/4') === timeSignatureFilter;

      const matchesSearch =
        query.length === 0 ||
        normalizeText(song.title).includes(query) ||
        normalizeText(song.notes).includes(query);

      return matchesTempo && matchesTimeSignature && matchesScaleType && matchesScaleKey && matchesSearch;
    });
  }, [songs, tempoFilter, timeSignatureFilter, scaleTypeFilter, scaleKeyFilter, searchQuery]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      if (name === 'scaleType') {
        return {
          ...prev,
          scaleType: value,
          scaleKey: value === 'minor' ? 'A' : 'C',
        };
      }
      if (name === 'timeSignature') {
        return {
          ...prev,
          timeSignature: value,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const titles = (formData.title || '')
      .split(/\r?\n|[,;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (titles.length === 0) {
      setErrorMessage('At least one song title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (editingSongId) {
        // Single edit
        await updateSong(editingSongId, {
          title: titles[0],
          tempo: formData.tempo,
          timeSignature: formData.timeSignature,
          scale: `${formData.scaleType}-${formData.scaleKey}`,
          notes: formData.notes,
        });
      } else {
        await Promise.all(
          titles.map((title) =>
            createSong({
              title,
              tempo: formData.tempo,
              timeSignature: formData.timeSignature,
              scale: `${formData.scaleType}-${formData.scaleKey}`,
              notes: formData.notes,
            })
          )
        );
      }

      setSuccessMessage(
        titles.length > 1
          ? `${titles.length} songs saved successfully to Firebase.`
          : editingSongId
          ? 'Song updated successfully.'
          : 'Song saved successfully to Firebase.'
      );
      setFormData(initialFormState);
      setEditingSongId(null);
      await loadSongs();
    } catch (error) {
      console.error('Error saving song:', error);
      setErrorMessage('Failed to save song. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSong = (song) => {
    const songScale = song.scale || 'major-C';
    const [songScaleType, songScaleKey] = songScale.split('-');

    setFormData({
      title: song.title || '',
      tempo: song.tempo || 'slow',
      timeSignature: song.timeSignature || '4/4',
      scaleType: songScaleType || 'major',
      scaleKey: songScaleKey || (songScaleType === 'minor' ? 'A' : 'C'),
      notes: song.notes || '',
    });

    setEditingSongId(song.id);
    setShowNewSongForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSongId(null);
    setFormData(initialFormState);
    setShowNewSongForm(false);
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Delete this song?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteSong(songId);
      setSuccessMessage('Song deleted successfully.');
      await loadSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      setErrorMessage('Failed to delete song.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleNewSongForm = () => {
    setShowNewSongForm((prev) => !prev);
  };

  const closeNewSongForm = () => {
    setShowNewSongForm(false);
    setFormData(initialFormState);
  };

  return (
    <div className="song-management-page">
      <div className="song-management-header">
        <div>
          <p className="eyebrow">Music Library</p>
          <h1>🎵 Song Manager</h1>
          <p className="song-organiser-text">Worship Song Organiser</p>
        </div>
        <div className="song-management-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          {!showNewSongForm ? (
            <button type="button" className="primary-btn compact-btn" onClick={toggleNewSongForm}>
              + Add Song
            </button>
          ) : (
            <button type="button" className="secondary-btn" onClick={closeNewSongForm}>
              Show Songs
            </button>
          )}
        </div>
      </div>

      {successMessage && <div className="song-alert success">✅ {successMessage}</div>}
      {errorMessage && <div className="song-alert error">❌ {errorMessage}</div>}

      {showNewSongForm ? (
        <div className="song-form-card single-form-card">
          <div className="song-form-topbar">
            <h2>{editingSongId ? 'Edit Song' : 'Add New Song'}</h2>
            <div>
              {editingSongId ? (
                <button type="button" className="text-btn" onClick={handleCancelEdit}>Cancel Edit</button>
              ) : null}
              <button type="button" className="text-btn" onClick={closeNewSongForm}>Close</button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="tempo">Tempo</label>
                <select
                  id="tempo"
                  name="tempo"
                  value={formData.tempo}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="slow">Slow</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time-signature">Time Signature</label>
                <select
                  id="time-signature"
                  name="timeSignature"
                  value={formData.timeSignature}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {popularTimeSignatures.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="scale-type">Scale Type</label>
                <select
                  id="scale-type"
                  name="scaleType"
                  value={formData.scaleType}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {scaleTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="scale-key">Scale</label>
              <select
                id="scale-key"
                name="scaleKey"
                value={formData.scaleKey}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {currentScaleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Song Titles</label>
              <textarea
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Add one title per line, or separate by commas"
                rows="5"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional song notes or arrangement details"
                rows="4"
                disabled={isSubmitting}
              />
            </div>

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingSongId ? 'Save Changes' : 'Save Song'}
            </button>
          </form>
        </div>
      ) : (
        <div className="song-list-card list-only-card">
          <div className="song-list-header">
            <h2>All Songs</h2>
            <span>{filteredSongs.length} shown</span>
          </div>

          <div className="song-filters">
            <div className="filter-block">
              <label htmlFor="tempo-filter">Tempo</label>
              <select
                id="tempo-filter"
                value={tempoFilter}
                onChange={(event) => setTempoFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="slow">Slow</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div className="filter-block">
              <label htmlFor="scale-type-filter">Scale Type</label>
              <select
                id="scale-type-filter"
                value={scaleTypeFilter}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setScaleTypeFilter(nextValue);
                  if (nextValue === 'all') {
                    setScaleKeyFilter('all');
                  } else {
                    setScaleKeyFilter(nextValue === 'minor' ? 'A' : 'C');
                  }
                }}
              >
                <option value="all">All</option>
                {scaleTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-block">
              <label htmlFor="time-signature-filter">Time Signature</label>
              <select
                id="time-signature-filter"
                value={timeSignatureFilter}
                onChange={(event) => setTimeSignatureFilter(event.target.value)}
              >
                <option value="all">All</option>
                {popularTimeSignatures.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-block">
              <label htmlFor="scale-key-filter">Scale</label>
              <select
                id="scale-key-filter"
                value={scaleKeyFilter}
                onChange={(event) => setScaleKeyFilter(event.target.value)}
              >
                <option value="all">All</option>
                {currentFilterScaleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-block search-block">
              <label htmlFor="search-query">Search</label>
              <input
                id="search-query"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Filter by title or notes"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="song-empty-state">Loading songs...</div>
          ) : filteredSongs.length === 0 ? (
            <div className="song-empty-state">No songs match the selected filters.</div>
          ) : (
            <div className="song-list">
              {filteredSongs.map((song) => (
                <div key={song.id} className="song-item">
                  <div className="song-item-top">
                    <h3>{song.title}</h3>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteSong(song.id)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEditSong(song)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="song-tags">
                    <span className="song-tag tempo-tag">{song.tempo || 'slow'}</span>
                    <span className="song-tag time-signature-tag">{song.timeSignature || '4/4'}</span>
                    <span className="song-tag scale-tag">
                      {(() => {
                        const songScale = song.scale || 'major-C';
                        const [songScaleType, songScaleKey] = songScale.split('-');
                        const scaleLabel = songScaleType === 'minor' ? minorScaleOptions : majorScaleOptions;
                        const selectedScale = scaleLabel.find((option) => option.value === (songScaleKey || 'C'));
                        return `${songScaleType ? songScaleType.charAt(0).toUpperCase() + songScaleType.slice(1) : 'Major'} ${selectedScale ? selectedScale.value : songScaleKey || 'C'}`;
                      })()}
                    </span>
                  </div>

                  {song.notes && <p className="song-notes">{song.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="song-powered-by">
        <div className="song-powered-by-inner">
          <span className="powered-by-label">Powered by</span>
          <h3>Christ AG Church Kazhakkoottam</h3>
          <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
          <p>Thiruvananthapuram, Kerala 695582</p>
        </div>
      </div>
    </div>
  );
};

export default SongManagement;
