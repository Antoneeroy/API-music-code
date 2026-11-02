import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDuration,
  searchTracksInCatalog,
  validateApiResponse,
  shuffleTracks,
  SAMPLE_CATALOG
} from './musicApi.ts';
import { ApiResponse } from '../types/music.ts';

test('formatDuration converts seconds to mm:ss format accurately', () => {
  assert.equal(formatDuration(210), '3:30');
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(59), '0:59');
  assert.equal(formatDuration(60), '1:00');
  assert.equal(formatDuration(125), '2:05');
  assert.equal(formatDuration(-10), '0:00');
});

test('searchTracksInCatalog filters tracks correctly by title, artist, and genre', () => {
  const acousticResults = searchTracksInCatalog(SAMPLE_CATALOG, 'acoustic');
  assert.ok(acousticResults.length >= 2, 'Should find at least 2 acoustic tracks');

  const artistResults = searchTracksInCatalog(SAMPLE_CATALOG, 'Benjamin');
  assert.equal(artistResults.length, 1);
  assert.equal(artistResults[0].id, 'D7Ky5');

  const emptyQueryResults = searchTracksInCatalog(SAMPLE_CATALOG, '   ');
  assert.equal(emptyQueryResults.length, SAMPLE_CATALOG.length);

  const nonExistentResults = searchTracksInCatalog(SAMPLE_CATALOG, 'xyz999nonexistent');
  assert.equal(nonExistentResults.length, 0);
});

test('validateApiResponse accepts valid user specification payload', () => {
  const validPayload: ApiResponse = {
    success: true,
    total: 1,
    results: [
      {
        id: 'D7Ky5',
        title: 'Song Title',
        artist: 'Artist Name',
        duration: 210,
        artwork: 'https://cdn.example.com/art.jpg',
        stream_url: 'https://cdn.example.com/stream?app_name=mycustommusicapi'
      }
    ]
  };

  const check = validateApiResponse(validPayload);
  assert.equal(check.valid, true);
  assert.equal(check.errors.length, 0);
});

test('validateApiResponse accepts null artwork (as required for fallback placeholder testing)', () => {
  const payloadWithNullArtwork: ApiResponse = {
    success: true,
    total: 1,
    results: [
      {
        id: 'Nu09q',
        title: 'Track Without Art',
        artist: 'Indie Band',
        duration: 180,
        artwork: null,
        stream_url: 'https://cdn.example.com/audio.mp3'
      }
    ]
  };

  const check = validateApiResponse(payloadWithNullArtwork);
  assert.equal(check.valid, true);
});

test('validateApiResponse catches schema violations and missing required fields', () => {
  const invalidPayload = {
    success: true,
    total: 1,
    results: [
      {
        id: '',
        title: 'Broken Track',
        artist: 'Artist',
        // missing duration
        artwork: 'invalid-art',
        stream_url: 'ftp://not-http'
      }
    ]
  };

  const check = validateApiResponse(invalidPayload);
  assert.equal(check.valid, false);
  assert.ok(check.errors.length > 0);
});

test('shuffleTracks preserves current playing track at index 0', () => {
  const tracks = [...SAMPLE_CATALOG];
  const shuffled = shuffleTracks(tracks, 2);
  assert.equal(shuffled.length, tracks.length);
  assert.equal(shuffled[0].id, tracks[2].id);
});
