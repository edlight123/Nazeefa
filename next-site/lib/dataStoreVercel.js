// Enhanced data store with fallback for Vercel deployment
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

// Check if we're in a serverless environment (Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Default data (same as original)
const defaultArticles = [
  {
    id: '1',
    title: "Genome-wide study makes 'quantum leap' in understanding stuttering",
    href: 'https://www.science.org/content/article/genome-wide-study-makes-quantum-leap-understanding-stuttering',
    outlet: 'Science Magazine',
    date: '2025',
    order: 0
  },
  {
    id: '2',
    title: 'Why do some moms have more boys than girls—or vice versa? New study provides clues',
    href: 'https://www.science.org/content/article/why-do-some-moms-have-more-boys-girls-or-vice-versa-new-study-provides-clues',
    outlet: 'Science Magazine',
    date: '2025',
    order: 1
  },
  {
    id: '3',
    title: "Comprehensive look at U.S. children's health finds 'steady decline'",
    href: 'https://www.science.org/content/article/comprehensive-look-u-s-children-s-health-finds-steady-decline',
    outlet: 'Science Magazine',
    date: '2025',
    order: 2
  },
  {
    id: '4',
    title: "Using electrons to make art, this scientist's biology images grace rock albums and stamps",
    href: 'https://www.science.org/content/article/using-electrons-make-art-scientist-s-biology-images-grace-rock-albums-and-stamps',
    outlet: 'Science Magazine',
    date: '2025',
    order: 3
  },
  {
    id: '5',
    title: 'Giant virus with record-long tail discovered in Pacific Ocean',
    href: 'https://www.science.org/content/article/giant-virus-record-long-tail-discovered-pacific-ocean',
    outlet: 'Science Magazine',
    date: '2025',
    order: 4
  },
  {
    id: '6',
    title: 'Social media attacks on public health agencies are eroding trust',
    href: 'https://www.science.org/content/article/social-media-attacks-public-health-agencies-are-eroding-trust',
    outlet: 'Science Magazine',
    date: '2025',
    order: 5
  },
  {
    id: '7',
    title: "University of Calgary's Aquatic Centre struggling with aging infrastructure",
    href: 'https://thegauntlet.ca/2025/01/31/university-of-calgarys-aquatic-centre-struggling-with-aging-infrastructure-and-high-demand-mirroring-citywide-pool-challenges/',
    outlet: 'The Gauntlet',
    date: '2025',
    order: 6
  }
];

const defaultPhotos = [
  {
    id: '1',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4415.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 0
  },
  {
    id: '2',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4402.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 1
  },
  {
    id: '3',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4502.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 2
  },
  {
    id: '4',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4487.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 3
  },
  {
    id: '5',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4516.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 4
  },
  {
    id: '6',
    src: 'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4434.jpg',
    alt: 'Photography by Nazeefa Ahmed',
    order: 5
  }
];

// In-memory storage for serverless environments
let memoryArticles = null;
let memoryPhotos = null;

// Initialize data store
function initializeDataStore() {
  if (!isServerless) {
    // Local development - use files
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(defaultArticles, null, 2));
    }
    
    if (!fs.existsSync(PHOTOS_FILE)) {
      fs.writeFileSync(PHOTOS_FILE, JSON.stringify(defaultPhotos, null, 2));
    }
  } else {
    // Serverless - use memory with defaults
    if (!memoryArticles) memoryArticles = [...defaultArticles];
    if (!memoryPhotos) memoryPhotos = [...defaultPhotos];
  }
}

export class DataStore {
  static init() {
    initializeDataStore();
  }

  static getArticles() {
    if (isServerless) {
      this.init();
      return memoryArticles ? [...memoryArticles].sort((a, b) => a.order - b.order) : [...defaultArticles];
    }
    
    try {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
      return JSON.parse(data).sort((a, b) => a.order - b.order);
    } catch (error) {
      return [...defaultArticles];
    }
  }

  static saveArticles(articles) {
    if (isServerless) {
      memoryArticles = [...articles];
      return;
    }
    
    try {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    } catch (error) {
      console.error('Failed to save articles:', error);
    }
  }

  static getPhotos() {
    if (isServerless) {
      this.init();
      return memoryPhotos ? [...memoryPhotos].sort((a, b) => a.order - b.order) : [...defaultPhotos];
    }
    
    try {
      const data = fs.readFileSync(PHOTOS_FILE, 'utf8');
      return JSON.parse(data).sort((a, b) => a.order - b.order);
    } catch (error) {
      return [...defaultPhotos];
    }
  }

  static savePhotos(photos) {
    if (isServerless) {
      memoryPhotos = [...photos];
      return;
    }
    
    try {
      fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2));
    } catch (error) {
      console.error('Failed to save photos:', error);
    }
  }

  static addArticle(article) {
    const articles = this.getArticles();
    const newArticle = {
      ...article,
      id: Date.now().toString(),
      order: articles.length
    };
    articles.push(newArticle);
    this.saveArticles(articles);
    return newArticle;
  }

  static updateArticle(id, updatedArticle) {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updatedArticle };
      this.saveArticles(articles);
      return articles[index];
    }
    return null;
  }

  static deleteArticle(id) {
    const articles = this.getArticles();
    const filteredArticles = articles.filter(a => a.id !== id);
    // Reorder remaining articles
    filteredArticles.forEach((article, index) => {
      article.order = index;
    });
    this.saveArticles(filteredArticles);
  }

  static reorderArticles(orderedIds) {
    const articles = this.getArticles();
    const reorderedArticles = orderedIds.map((id, index) => {
      const article = articles.find(a => a.id === id);
      return article ? { ...article, order: index } : null;
    }).filter(Boolean);
    this.saveArticles(reorderedArticles);
  }

  static addPhoto(photo) {
    const photos = this.getPhotos();
    const newPhoto = {
      ...photo,
      id: Date.now().toString(),
      order: photos.length
    };
    photos.push(newPhoto);
    this.savePhotos(photos);
    return newPhoto;
  }

  static deletePhoto(id) {
    const photos = this.getPhotos();
    const filteredPhotos = photos.filter(p => p.id !== id);
    // Reorder remaining photos
    filteredPhotos.forEach((photo, index) => {
      photo.order = index;
    });
    this.savePhotos(filteredPhotos);
  }

  static reorderPhotos(orderedIds) {
    const photos = this.getPhotos();
    const reorderedPhotos = orderedIds.map((id, index) => {
      const photo = photos.find(p => p.id === id);
      return photo ? { ...photo, order: index } : null;
    }).filter(Boolean);
    this.savePhotos(reorderedPhotos);
  }
}