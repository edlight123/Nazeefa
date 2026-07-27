import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from './firebaseAdmin';
import { DataStore as LegacyDataStore } from './dataStoreVercel';

const ARTICLES_COLLECTION = 'articles';
const PHOTOS_COLLECTION = 'photos';

function normalizeOrder(item, fallback) {
  if (typeof item.order === 'number') return item.order;
  if (typeof item.order === 'string' && item.order.trim() !== '') {
    const n = Number(item.order);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export class DataStore {
  static async getArticles() {
    try {
      const db = getDb();
      const snap = await db.collection(ARTICLES_COLLECTION).orderBy('order', 'asc').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error('Falling back to legacy articles store:', e.message);
      return LegacyDataStore.getArticles();
    }
  }

  static async getPhotos() {
    try {
      const db = getDb();
      const snap = await db.collection(PHOTOS_COLLECTION).orderBy('order', 'asc').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error('Falling back to legacy photos store:', e.message);
      return LegacyDataStore.getPhotos();
    }
  }

  static async addArticle(article) {
    const db = getDb();
    const current = await db.collection(ARTICLES_COLLECTION).orderBy('order', 'desc').limit(1).get();
    const maxOrder = current.empty ? -1 : Number(current.docs[0].get('order') ?? -1);
    const order = typeof article.order === 'number' ? article.order : maxOrder + 1;

    const ref = await db.collection(ARTICLES_COLLECTION).add({
      title: article.title ?? '',
      href: article.href ?? '',
      outlet: article.outlet ?? '',
      date: article.date ?? '',
      order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    const saved = await ref.get();
    return { id: saved.id, ...saved.data() };
  }

  static async updateArticle(id, updatedArticle) {
    const db = getDb();
    const ref = db.collection(ARTICLES_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;

    await ref.set({ ...updatedArticle, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    const next = await ref.get();
    return { id: next.id, ...next.data() };
  }

  static async deleteArticle(id) {
    const db = getDb();
    await db.collection(ARTICLES_COLLECTION).doc(id).delete();

    const articles = await this.getArticles();
    await this.saveArticles(
      articles
        .sort((a, b) => normalizeOrder(a, 0) - normalizeOrder(b, 0))
        .map((a, idx) => ({ ...a, order: idx }))
    );
  }

  static async reorderArticles(orderedIds) {
    const db = getDb();
    const batch = db.batch();
    orderedIds.forEach((id, index) => {
      batch.set(
        db.collection(ARTICLES_COLLECTION).doc(id),
        { order: index, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
    await batch.commit();
  }

  static async addPhoto(photo) {
    const db = getDb();
    const current = await db.collection(PHOTOS_COLLECTION).orderBy('order', 'desc').limit(1).get();
    const maxOrder = current.empty ? -1 : Number(current.docs[0].get('order') ?? -1);
    const order = typeof photo.order === 'number' ? photo.order : maxOrder + 1;

    const ref = await db.collection(PHOTOS_COLLECTION).add({
      src: photo.src ?? '',
      alt: photo.alt ?? 'Photography by Nazeefa Ahmed',
      type: photo.type === 'video' ? 'video' : 'image',
      videoKind: photo.type === 'video' ? photo.videoKind ?? 'upload' : null,
      embedUrl: photo.type === 'video' ? photo.embedUrl ?? null : null,
      storagePath: photo.storagePath ?? null,
      order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    const saved = await ref.get();
    return { id: saved.id, ...saved.data() };
  }

  static async deletePhoto(id) {
    const db = getDb();
    await db.collection(PHOTOS_COLLECTION).doc(id).delete();

    const photos = await this.getPhotos();
    await this.savePhotos(
      photos
        .sort((a, b) => normalizeOrder(a, 0) - normalizeOrder(b, 0))
        .map((p, idx) => ({ ...p, order: idx }))
    );
  }

  static async reorderPhotos(orderedIds) {
    const db = getDb();
    const batch = db.batch();
    orderedIds.forEach((id, index) => {
      batch.set(
        db.collection(PHOTOS_COLLECTION).doc(id),
        { order: index, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
    await batch.commit();
  }

  static async saveArticles(articles) {
    const db = getDb();
    const batch = db.batch();
    articles.forEach((a) => {
      if (!a.id) return;
      const { id, ...data } = a;
      batch.set(
        db.collection(ARTICLES_COLLECTION).doc(id),
        { ...data, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
    await batch.commit();
  }

  static async savePhotos(photos) {
    const db = getDb();
    const batch = db.batch();
    photos.forEach((p) => {
      if (!p.id) return;
      const { id, ...data } = p;
      batch.set(
        db.collection(PHOTOS_COLLECTION).doc(id),
        { ...data, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
    await batch.commit();
  }
}
