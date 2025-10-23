import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Triangle, 
  Sigma, 
  TrendingUp, 
  BarChart3, 
  Shapes, 
  Circle, 
  Square, 
  Hexagon,
  Box,
  Cylinder,
  Sparkles,
  Calculator,
  ChevronDown
} from 'lucide-react';

// Tipe data untuk halaman yang aktif
type Page = 'home' | 'trigonometri' | 'aljabar' | 'kalkulus' | 'statistika' | 'geometri' | 'lingkaran' | 'persegi' | 'persegi-panjang' | 'segitiga' | 'trapesium' | 'jajaran-genjang' | 'kubus' | 'silinder' | 'bola' | 'kerucut' | 'balok' | 'limas' | 'belah-ketupat' | 'layang-layang';

// Tipe data untuk konfigurasi input field
interface InputConfig {
  id: string;
  label: string;
  placeholder: string;
}

// Tipe data untuk properti setiap halaman geometri
interface GeometryShape {
  id: Page;
  title: string;
  inputs: InputConfig[];
  formula: string;
  unit: 'Luas' | 'Volume';
  calculation: (inputs: { [key: string]: number }) => number;
  explanation: string;
}

// --- Data Konfigurasi untuk Halaman Geometri ---
const geometryData: GeometryShape[] = [
  {
    id: 'lingkaran',
    title: 'Luas Lingkaran',
    inputs: [{ id: 'radius', label: 'Jari-jari (r)', placeholder: 'Contoh: 10' }],
    formula: 'Luas = π × r²',
    unit: 'Luas',
    calculation: ({ radius = 0 }) => Math.PI * Math.pow(radius, 2),
    explanation: 'Lingkaran adalah bentuk yang terdiri dari semua titik dalam bidang yang berjarak sama dari titik tertentu, yang disebut pusat. Luasnya dihitung dengan mengalikan Pi (π ≈ 3.14159) dengan kuadrat dari jari-jarinya (r).',
  },
  {
    id: 'persegi',
    title: 'Luas Persegi',
    inputs: [{ id: 'side', label: 'Sisi (s)', placeholder: 'Contoh: 12' }],
    formula: 'Luas = s × s',
    unit: 'Luas',
    calculation: ({ side = 0 }) => side * side,
    explanation: 'Persegi adalah bangun datar yang memiliki empat sisi sama panjang dan empat sudut siku-siku (90 derajat). Luasnya adalah hasil perkalian panjang sisinya dengan dirinya sendiri.',
  },
  {
    id: 'persegi-panjang',
    title: 'Luas Persegi Panjang',
    inputs: [
        { id: 'length', label: 'Panjang (p)', placeholder: 'Contoh: 15' },
        { id: 'width', label: 'Lebar (l)', placeholder: 'Contoh: 8' }
    ],
    formula: 'Luas = p × l',
    unit: 'Luas',
    calculation: ({ length = 0, width = 0 }) => length * width,
    explanation: 'Persegi panjang adalah bangun datar dengan empat sudut siku-siku, di mana sisi-sisi yang berhadapan sama panjang. Luasnya dihitung dengan mengalikan panjang dan lebarnya.',
  },
  {
    id: 'segitiga',
    title: 'Luas Segitiga',
    inputs: [
        { id: 'base', label: 'Alas (a)', placeholder: 'Contoh: 10' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 5' }
    ],
    formula: 'Luas = ½ × a × t',
    unit: 'Luas',
    calculation: ({ base = 0, height = 0 }) => 0.5 * base * height,
    explanation: 'Segitiga adalah poligon dengan tiga ujung dan tiga simpul. Luasnya dihitung dengan mengalikan setengah dari alasnya dengan tingginya (jarak tegak lurus dari alas ke titik puncak).',
  },
  {
    id: 'jajaran-genjang',
    title: 'Luas Jajaran Genjang',
    inputs: [
        { id: 'base', label: 'Alas (a)', placeholder: 'Contoh: 20' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 10' }
    ],
    formula: 'Luas = a × t',
    unit: 'Luas',
    calculation: ({ base = 0, height = 0 }) => base * height,
    explanation: 'Jajaran genjang adalah bangun datar dengan dua pasang sisi sejajar. Luasnya dihitung dengan mengalikan panjang alas dengan tingginya (jarak tegak lurus antara alas dan sisi atas).',
  },
  {
    id: 'trapesium',
    title: 'Luas Trapesium',
    inputs: [
        { id: 'baseA', label: 'Sisi Atas (a)', placeholder: 'Contoh: 8' },
        { id: 'baseB', label: 'Sisi Bawah (b)', placeholder: 'Contoh: 12' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 7' }
    ],
    formula: 'Luas = ½ × (a + b) × t',
    unit: 'Luas',
    calculation: ({ baseA = 0, baseB = 0, height = 0 }) => 0.5 * (baseA + baseB) * height,
    explanation: 'Trapesium adalah bangun datar yang memiliki sepasang sisi sejajar. Luasnya dihitung dengan menjumlahkan panjang sisi sejajar, mengalikannya dengan tinggi, lalu membaginya dua.',
  },
  {
    id: 'belah-ketupat',
    title: 'Luas Belah Ketupat',
    inputs: [
        { id: 'diagonal1', label: 'Diagonal 1 (d₁)', placeholder: 'Contoh: 12' },
        { id: 'diagonal2', label: 'Diagonal 2 (d₂)', placeholder: 'Contoh: 16' }
    ],
    formula: 'Luas = ½ × d₁ × d₂',
    unit: 'Luas',
    calculation: ({ diagonal1 = 0, diagonal2 = 0 }) => 0.5 * diagonal1 * diagonal2,
    explanation: 'Belah ketupat adalah bangun datar yang memiliki empat sisi sama panjang dengan sudut-sudut yang berhadapan sama besar. Luasnya dihitung dengan setengah dari hasil kali kedua diagonalnya.',
  },
  {
    id: 'layang-layang',
    title: 'Luas Layang-Layang',
    inputs: [
        { id: 'diagonal1', label: 'Diagonal 1 (d₁)', placeholder: 'Contoh: 10' },
        { id: 'diagonal2', label: 'Diagonal 2 (d₂)', placeholder: 'Contoh: 14' }
    ],
    formula: 'Luas = ½ × d₁ × d₂',
    unit: 'Luas',
    calculation: ({ diagonal1 = 0, diagonal2 = 0 }) => 0.5 * diagonal1 * diagonal2,
    explanation: 'Layang-layang adalah bangun datar yang memiliki dua pasang sisi yang sama panjang dan bersebelahan. Seperti belah ketupat, luasnya juga dihitung dengan setengah dari hasil kali kedua diagonalnya.',
  },
  {
    id: 'kubus',
    title: 'Volume Kubus',
    inputs: [{ id: 'side', label: 'Sisi (s)', placeholder: 'Contoh: 6' }],
    formula: 'Volume = s × s × s',
    unit: 'Volume',
    calculation: ({ side = 0 }) => Math.pow(side, 3),
    explanation: 'Kubus adalah bangun ruang tiga dimensi yang dibatasi oleh enam bidang sisi berbentuk persegi. Volumenya, atau isi, dihitung dengan mengalikan panjang sisinya sebanyak tiga kali.',
  },
  {
    id: 'balok',
    title: 'Volume Balok',
    inputs: [
        { id: 'length', label: 'Panjang (p)', placeholder: 'Contoh: 10' },
        { id: 'width', label: 'Lebar (l)', placeholder: 'Contoh: 5' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 8' }
    ],
    formula: 'Volume = p × l × t',
    unit: 'Volume',
    calculation: ({ length = 0, width = 0, height = 0 }) => length * width * height,
    explanation: 'Balok adalah bangun ruang yang dibentuk oleh tiga pasang persegi panjang. Volumenya dihitung dengan mengalikan panjang, lebar, dan tingginya.',
  },
  {
    id: 'silinder',
    title: 'Volume Silinder',
    inputs: [
        { id: 'radius', label: 'Jari-jari (r)', placeholder: 'Contoh: 5' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 10' }
    ],
    formula: 'Volume = π × r² × t',
    unit: 'Volume',
    calculation: ({ radius = 0, height = 0 }) => Math.PI * Math.pow(radius, 2) * height,
    explanation: 'Silinder atau tabung adalah bangun ruang tiga dimensi yang dibentuk oleh dua lingkaran identik yang sejajar dan sebuah persegi panjang yang mengelilingi keduanya. Volumenya dihitung dengan mengalikan luas alas (lingkaran) dengan tingginya.',
  },
  {
    id: 'bola',
    title: 'Volume Bola',
    inputs: [{ id: 'radius', label: 'Jari-jari (r)', placeholder: 'Contoh: 7' }],
    formula: 'Volume = 4/3 × π × r³',
    unit: 'Volume',
    calculation: ({ radius = 0 }) => (4/3) * Math.PI * Math.pow(radius, 3),
    explanation: 'Bola adalah bangun ruang tiga dimensi yang semua titik pada permukaannya berjarak sama dari pusatnya. Volumenya dihitung dengan rumus 4/3 dikali Pi dikali jari-jari pangkat tiga.',
  },
  {
    id: 'kerucut',
    title: 'Volume Kerucut',
    inputs: [
        { id: 'radius', label: 'Jari-jari (r)', placeholder: 'Contoh: 4' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 9' }
    ],
    formula: 'Volume = 1/3 × π × r² × t',
    unit: 'Volume',
    calculation: ({ radius = 0, height = 0 }) => (1/3) * Math.PI * Math.pow(radius, 2) * height,
    explanation: 'Kerucut adalah bangun ruang yang memiliki alas berbentuk lingkaran dan satu titik puncak. Volumenya adalah sepertiga dari volume silinder dengan jari-jari dan tinggi yang sama.',
  },
  {
    id: 'limas',
    title: 'Volume Limas Segiempat',
    inputs: [
        { id: 'side', label: 'Sisi Alas (s)', placeholder: 'Contoh: 6' },
        { id: 'height', label: 'Tinggi (t)', placeholder: 'Contoh: 9' }
    ],
    formula: 'Volume = 1/3 × s² × t',
    unit: 'Volume',
    calculation: ({ side = 0, height = 0 }) => (1/3) * Math.pow(side, 2) * height,
    explanation: 'Limas segiempat adalah bangun ruang dengan alas berbentuk persegi dan empat sisi berbentuk segitiga yang bertemu di satu titik puncak. Volumenya adalah sepertiga dari luas alas dikali tinggi.',
  }
];


// --- Komponen-Komponen Tampilan ---

const Header = () => (
  <header className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
    
    <div className="relative container mx-auto px-6 py-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
        <Calculator className="w-10 h-10 text-white" strokeWidth={2.5} />
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Pusat Belajar Matematika
        </h1>
      </div>
      <p className="text-white/90 text-xl md:text-2xl font-medium animate-slide-up">
        Menjelajahi Dunia Angka dengan Interaktif ✨
      </p>
    </div>
  </header>
);

const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: Page) => void; currentPage: Page }) => {
  const [isGeometryOpen, setIsGeometryOpen] = useState(false);
  
  const navItems = [
    { id: 'home' as Page, label: 'Beranda', icon: Home },
    { id: 'trigonometri' as Page, label: 'Trigonometri', icon: Triangle },
    { id: 'aljabar' as Page, label: 'Aljabar', icon: Sigma },
    { id: 'kalkulus' as Page, label: 'Kalkulus', icon: TrendingUp },
    { id: 'statistika' as Page, label: 'Statistika', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                    : 'hover:bg-white/10 text-foreground/80 hover:text-foreground hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          
          <div className="relative">
            <button
              onClick={() => setIsGeometryOpen(!isGeometryOpen)}
              onMouseEnter={() => setIsGeometryOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                currentPage === 'geometri' || geometryData.some(s => s.id === currentPage)
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                  : 'hover:bg-white/10 text-foreground/80 hover:text-foreground hover:scale-105'
              }`}
            >
              <Shapes className="w-4 h-4" />
              Geometri
              <ChevronDown className={`w-4 h-4 transition-transform ${isGeometryOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isGeometryOpen && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xl max-h-96 overflow-y-auto glass border border-white/20 rounded-xl shadow-2xl animate-scale-in z-50"
                onMouseLeave={() => setIsGeometryOpen(false)}
              >
                <div className="p-2">
                  <div className="mb-3 px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-primary">Bangun Datar (2D)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {geometryData.filter(s => s.unit === 'Luas').map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          onNavigate(shape.id);
                          setIsGeometryOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Circle className="w-4 h-4 text-primary" />
                        {shape.title.replace('Luas ', '')}
                      </button>
                    ))}
                  </div>
                  
                  <div className="px-3 py-2 border-t border-b border-white/10">
                    <p className="text-sm font-semibold text-secondary">Bangun Ruang (3D)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {geometryData.filter(s => s.unit === 'Volume').map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          onNavigate(shape.id);
                          setIsGeometryOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary/10 rounded-lg transition-colors"
                      >
                        <Box className="w-4 h-4 text-secondary" />
                        {shape.title.replace('Volume ', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="glass rounded-2xl p-8 md:p-12 text-center border border-white/20">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-slow" />
          <Sparkles className="relative w-20 h-20 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
        Selamat Datang, Penjelajah Matematika!
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Aplikasi ini dirancang untuk membantu Anda memahami konsep matematika inti dengan cara yang visual dan interaktif.
        Gunakan navigasi di atas untuk memilih topik, mulai dari Aljabar hingga Geometri 3D.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { id: 'trigonometri', icon: Triangle, title: 'Trigonometri', desc: 'Eksplorasi hubungan sudut dan sisi', gradient: 'from-primary to-primary-dark' },
        { id: 'aljabar', icon: Sigma, title: 'Aljabar', desc: 'Selesaikan persamaan linear', gradient: 'from-secondary to-secondary-light' },
        { id: 'kalkulus', icon: TrendingUp, title: 'Kalkulus', desc: 'Turunan dan integral fungsi', gradient: 'from-accent to-accent-light' },
        { id: 'statistika', icon: BarChart3, title: 'Statistika', desc: 'Analisis data deskriptif', gradient: 'from-primary-light to-secondary' },
        { id: 'geometri', icon: Shapes, title: 'Geometri', desc: 'Hitung luas dan volume', gradient: 'from-accent-light to-primary' },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className="group glass rounded-xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-glow-md text-left"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {item.desc}
            </p>
          </button>
        );
      })}
    </div>
  </div>
);

const TrigonometryPage = () => {
    const [sides, setSides] = useState({ opposite: '3', adjacent: '4' });

    const handleSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSides(prev => ({ ...prev, [name]: value }));
    };

    const { opposite, adjacent, hypotenuse } = useMemo(() => {
        const o = parseFloat(sides.opposite) || 0;
        const a = parseFloat(sides.adjacent) || 0;
        const h = Math.sqrt(o*o + a*a);
        return { opposite: o, adjacent: a, hypotenuse: h };
    }, [sides]);

    const { sin, cos, tan, angle } = useMemo(() => {
        if (hypotenuse === 0) return { sin: 0, cos: 0, tan: 0, angle: 0 };
        const sinVal = opposite / hypotenuse;
        const cosVal = adjacent / hypotenuse;
        const tanVal = opposite / adjacent;
        const angleRad = Math.asin(sinVal); 
        const angleDeg = angleRad * (180 / Math.PI);
        return { sin: sinVal, cos: cosVal, tan: tanVal, angle: angleDeg };
    }, [opposite, adjacent, hypotenuse]);

    const scale = 150 / Math.max(adjacent, opposite, 1);
    const adjScaled = adjacent * scale;
    const oppScaled = opposite * scale;

    return (
        <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <Triangle className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Kalkulator Trigonometri</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="opposite" className="block mb-2 text-sm font-semibold text-foreground/80">
                              Sisi Depan (Opposite)
                            </label>
                            <input
                                type="number"
                                id="opposite"
                                name="opposite"
                                value={sides.opposite}
                                onChange={handleSideChange}
                                className="w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="adjacent" className="block mb-2 text-sm font-semibold text-foreground/80">
                              Sisi Samping (Adjacent)
                            </label>
                            <input
                                type="number"
                                id="adjacent"
                                name="adjacent"
                                value={sides.adjacent}
                                onChange={handleSideChange}
                                className="w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="glass-dark rounded-xl p-6 border border-white/10 animate-scale-in">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-primary" />
                          Hasil Perhitungan
                        </h3>
                        <p className="font-mono mb-4 text-muted-foreground">
                          Sisi Miring: <span className="text-primary font-bold">{hypotenuse.toFixed(2)}</span>
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-1">Sin (Depan/Miring)</p>
                                <p className="text-2xl font-bold text-primary mb-1">{sin.toFixed(3)}</p>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {opposite} / {hypotenuse.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                                <p className="text-xs text-muted-foreground mb-1">Cos (Samping/Miring)</p>
                                <p className="text-2xl font-bold text-secondary mb-1">{cos.toFixed(3)}</p>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {adjacent} / {hypotenuse.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                                <p className="text-xs text-muted-foreground mb-1">Tan (Depan/Samping)</p>
                                <p className="text-2xl font-bold text-accent mb-1">{tan.toFixed(3)}</p>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {opposite} / {adjacent}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-lg shadow-lg">
                                <p className="text-xs text-white/80 mb-1">Sudut (θ)</p>
                                <p className="text-2xl font-bold text-white mb-1">{angle.toFixed(2)}°</p>
                                <p className="text-xs font-mono text-white/70">
                                  asin({sin.toFixed(2)})
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                     <div className="w-[250px] h-[250px] relative glass-dark rounded-xl flex items-center justify-center border border-white/10">
                        <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
                            <defs>
                              <linearGradient id="triangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.3}} />
                                <stop offset="100%" style={{stopColor: 'hsl(var(--secondary))', stopOpacity: 0.3}} />
                              </linearGradient>
                            </defs>
                            <polygon 
                                points={`10,${205 - oppScaled} 10,205 ${10 + adjScaled},205`} 
                                fill="url(#triangleGrad)"
                                className="stroke-primary"
                                strokeWidth="3"
                            />
                            <text x={10 + adjScaled / 2} y={220} fontSize="14" fill="currentColor" textAnchor="middle" className="font-semibold">
                              Samping: {adjacent}
                            </text>
                            <text x={0} y={205 - oppScaled / 2} fontSize="14" fill="currentColor" transform="rotate(-90 5,200)" textAnchor="middle" className="font-semibold">
                              Depan: {opposite}
                            </text>
                            <text x={20} y={195} fontSize="16" fill="hsl(var(--primary))" fontWeight="bold">θ</text>
                            <text 
                              x={10 + adjScaled / 2} 
                              y={200 - oppScaled / 2} 
                              fontSize="14" 
                              fill="hsl(var(--accent))"
                              className="font-bold"
                            >
                              Miring: {hypotenuse.toFixed(1)}
                            </text>
                        </svg>
                    </div>
                    
                    <div className="glass-dark p-6 rounded-xl border border-white/10 max-w-sm">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-foreground">Trigonometri</span> mempelajari hubungan antara sudut dan sisi segitiga. 
                          Dengan mengetahui panjang sisi segitiga siku-siku, kita dapat menemukan rasio trigonometri dasarnya beserta besar sudutnya.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlgebraPage = () => {
  const [linearValues, setLinearValues] = useState({ a: '2', b: '10' });

  const handleLinearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinearValues(prev => ({ ...prev, [name]: value }));
  };

  const { a, b } = useMemo(() => ({
    a: parseFloat(linearValues.a) || 0,
    b: parseFloat(linearValues.b) || 0,
  }), [linearValues]);

  const x = useMemo(() => {
    if (a === 0) return 0;
    return b / a;
  }, [a, b]);

  const [termValues, setTermValues] = useState({
    a1: '2', b1: '3', c1: '1',
    a2: '4', b2: '-1', c2: '5',
  });

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTermValues(prev => ({ ...prev, [name]: value }));
  };

  const { a1, b1, c1, a2, b2, c2 } = useMemo(() => ({
    a1: parseFloat(termValues.a1) || 0,
    b1: parseFloat(termValues.b1) || 0,
    c1: parseFloat(termValues.c1) || 0,
    a2: parseFloat(termValues.a2) || 0,
    b2: parseFloat(termValues.b2) || 0,
    c2: parseFloat(termValues.c2) || 0,
  }), [termValues]);

  const simplified = useMemo(() => {
    const finalA = a1 + a2;
    const finalB = b1 + b2;
    const finalC = c1 + c2;

    const formatTerm = (coeff: number, variable: string) => {
      if (coeff === 0) return '';
      if (coeff === 1) return ` + ${variable}`;
      if (coeff === -1) return ` - ${variable}`;
      if (coeff > 0) return ` + ${coeff}${variable}`;
      return ` - ${Math.abs(coeff)}${variable}`;
    };

    const formatConstant = (coeff: number) => {
      if (coeff === 0) return '';
      if (coeff > 0) return ` + ${coeff}`;
      return ` - ${Math.abs(coeff)}`;
    };

    let result = '';
    result += formatTerm(finalA, 'x');
    result += formatTerm(finalB, 'y');
    result += formatConstant(finalC);

    if (result.startsWith(' + ')) {
      result = result.substring(3);
    } else if (result.startsWith(' - ')) {
      result = '-' + result.substring(3); 
    }

    return result.trim() || '0';
  }, [a1, b1, c1, a2, b2, c2]);

  return (
    <div className="space-y-8 animate-slide-up">
      
      <div className="glass rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Sigma className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Penyelesaian Persamaan Linear</h2>
        </div>
        <p className="text-center mb-6 text-muted-foreground">
          Masukkan nilai <span className="font-mono font-bold text-primary">a</span> dan <span className="font-mono font-bold text-primary">b</span> untuk menemukan nilai <span className="font-mono font-bold text-primary">x</span> dalam persamaan <span className="font-mono font-bold">ax = b</span>
        </p>
        
        <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
                <input
                    type="number"
                    name="a"
                    value={linearValues.a}
                    onChange={handleLinearChange}
                    className="w-24 px-4 py-3 bg-muted/50 border border-input rounded-xl text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <span className="text-3xl font-bold">×</span>
                <span className="text-3xl font-bold text-primary">x</span>
                <span className="text-3xl font-bold">=</span>
                <input
                    type="number"
                    name="b"
                    value={linearValues.b}
                    onChange={handleLinearChange}
                    className="w-24 px-4 py-3 bg-muted/50 border border-input rounded-xl text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>
            
            <div className="glass-dark rounded-xl p-6 border border-white/10 animate-scale-in">
                <p className="text-center text-sm text-muted-foreground mb-3">Hasil Penyelesaian</p>
                <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl shadow-glow-md">
                    <p className="text-4xl font-bold font-mono text-white text-center">
                      x = {a === 0 ? (b === 0 ? '∞' : 'Tidak Ada') : x.toFixed(2)}
                    </p>
                </div>
                {a === 0 && (
                  <p className="text-sm text-destructive text-center mt-3 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    Variabel 'a' tidak boleh nol
                  </p>
                )}
            </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-secondary" />
          <h2 className="text-3xl font-bold">Penyederhanaan Suku Aljabar</h2>
        </div>
        <p className="text-center mb-6 text-muted-foreground">
          Sederhanakan ekspresi <span className="font-mono font-bold">(a₁x + b₁y + c₁) + (a₂x + b₂y + c₂)</span>
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
            
            <div className="glass-dark rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-lg mb-4 text-center text-primary">Ekspresi 1</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="a1" 
                    value={termValues.a1} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="font-mono font-semibold">x +</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="b1" 
                    value={termValues.b1} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="font-mono font-semibold">y +</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="c1" 
                    value={termValues.c1} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-5xl font-bold text-primary animate-pulse-slow">
              +
            </div>

            <div className="glass-dark rounded-xl p-6 border border-white/10">
               <h3 className="font-semibold text-lg mb-4 text-center text-secondary">Ekspresi 2</h3>
               <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="a2" 
                    value={termValues.a2} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                  <span className="font-mono font-semibold">x +</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="b2" 
                    value={termValues.b2} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                  <span className="font-mono font-semibold">y +</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="c2" 
                    value={termValues.c2} 
                    onChange={handleTermChange} 
                    className="w-20 px-3 py-2 bg-muted/50 border border-input rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-xl p-6 border border-white/10 animate-scale-in">
            <p className="text-center text-sm text-muted-foreground mb-3">Hasil Sederhana</p>
            <div className="bg-gradient-to-br from-accent to-accent-light p-6 rounded-xl shadow-glow-md">
              <p className="text-4xl font-bold font-mono text-white text-center break-words">
                {simplified}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KalkulusPage = () => {
    const [funcType, setFuncType] = useState<'power' | 'exponential' | 'trigonometric'>('power');
    const [values, setValues] = useState({ coefficient: '2', power: '3', x: '4', a: '1', b: '5' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const { coefficient, power, x, a, b } = useMemo(() => ({
        coefficient: parseFloat(values.coefficient) || 0,
        power: parseFloat(values.power) || 0,
        x: parseFloat(values.x) || 0,
        a: parseFloat(values.a) || 0,
        b: parseFloat(values.b) || 0,
    }), [values]);

    const originalFunc = useMemo(() => {
        switch(funcType) {
            case 'power':
                return `f(x) = ${coefficient}x^${power}`;
            case 'exponential':
                return `f(x) = ${coefficient}e^x`;
            case 'trigonometric':
                return `f(x) = ${coefficient}sin(x)`;
            default:
                return '';
        }
    }, [funcType, coefficient, power]);

    const derivative = useMemo(() => {
        switch(funcType) {
            case 'power':
                return `f'(x) = ${(coefficient * power).toFixed(2)}x^${(power - 1).toFixed(0)}`;
            case 'exponential':
                return `f'(x) = ${coefficient}e^x`;
            case 'trigonometric':
                return `f'(x) = ${coefficient}cos(x)`;
            default:
                return '';
        }
    }, [funcType, coefficient, power]);

    const derivativeValue = useMemo(() => {
        switch(funcType) {
            case 'power':
                return coefficient * power * Math.pow(x, power - 1);
            case 'exponential':
                return coefficient * Math.exp(x);
            case 'trigonometric':
                return coefficient * Math.cos(x);
            default:
                return 0;
        }
    }, [funcType, coefficient, power, x]);

    const integral = useMemo(() => {
        switch(funcType) {
            case 'power':
                if (power === -1) {
                    return `∫f(x)dx = ${coefficient.toFixed(2)}ln|x| + C`;
                }
                const newPower = power + 1;
                const newCoeff = coefficient / newPower;
                return `∫f(x)dx = ${newCoeff.toFixed(2)}x^${newPower.toFixed(0)} + C`;
            case 'exponential':
                return `∫f(x)dx = ${coefficient}e^x + C`;
            case 'trigonometric':
                return `∫f(x)dx = ${(-coefficient).toFixed(2)}cos(x) + C`;
            default:
                return '';
        }
    }, [funcType, coefficient, power]);

    const definiteIntegral = useMemo(() => {
        let valB = 0;
        let valA = 0;

        switch(funcType) {
            case 'power':
                if (power === -1) {
                    valB = coefficient * Math.log(b);
                    valA = coefficient * Math.log(a);
                } else {
                    const newPower = power + 1;
                    const newCoeff = coefficient / newPower;
                    valB = newCoeff * Math.pow(b, newPower);
                    valA = newCoeff * Math.pow(a, newPower);
                }
                break;
            case 'exponential':
                valB = coefficient * Math.exp(b);
                valA = coefficient * Math.exp(a);
                break;
            case 'trigonometric':
                valB = -coefficient * Math.cos(b);
                valA = -coefficient * Math.cos(a);
                break;
        }
        if (isNaN(valB - valA)) return 0;
        return valB - valA;
    }, [funcType, coefficient, power, a, b]);


    return (
        <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Kalkulator Kalkulus</h2>
            </div>
            
            <div className="flex justify-center mb-8 p-1 glass-dark rounded-xl border border-white/10 max-w-2xl mx-auto">
                <button 
                  onClick={() => setFuncType('power')} 
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    funcType === 'power' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  Fungsi Pangkat
                </button>
                <button 
                  onClick={() => setFuncType('exponential')} 
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    funcType === 'exponential' 
                      ? 'bg-secondary text-secondary-foreground shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  Eksponensial
                </button>
                <button 
                  onClick={() => setFuncType('trigonometric')} 
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    funcType === 'trigonometric' 
                      ? 'bg-accent text-accent-foreground shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  Trigonometri
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-dark rounded-xl p-6 border border-white/10">
                    <h3 className="font-bold text-lg mb-4">Fungsi: <span className="font-mono text-primary">{originalFunc}</span></h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-foreground/80">
                              Koefisien (c)
                            </label>
                            <input
                                type="number"
                                name="coefficient"
                                value={values.coefficient}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {funcType === 'power' && (
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-foreground/80">
                                  Pangkat (n)
                                </label>
                                <input
                                    type="number"
                                    name="power"
                                    value={values.power}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        )}

                        <div className="pt-4 border-t border-white/10">
                          <h4 className="font-semibold mb-3">Parameter Kalkulasi</h4>
                          <div>
                              <label className="block mb-2 text-sm font-semibold text-foreground/80">
                                Nilai x (untuk turunan)
                              </label>
                              <input
                                  type="number"
                                  name="x"
                                  value={values.x}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block mb-2 text-sm font-semibold text-foreground/80">
                                 Batas Bawah (a)
                               </label>
                               <input
                                   type="number"
                                   name="a"
                                   value={values.a}
                                   onChange={handleInputChange}
                                   className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                               />
                           </div>
                            <div>
                               <label className="block mb-2 text-sm font-semibold text-foreground/80">
                                 Batas Atas (b)
                               </label>
                               <input
                                   type="number"
                                   name="b"
                                   value={values.b}
                                   onChange={handleInputChange}
                                   className="w-full px-4 py-3 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                               />
                           </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-primary/10 p-6 rounded-xl border border-primary/30 animate-scale-in">
                        <p className="text-sm text-primary font-semibold mb-2">Turunan</p>
                        <p className="font-mono text-xl font-bold">{derivative}</p>
                    </div>
                     <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-xl shadow-lg animate-scale-in">
                        <p className="text-sm text-white/90 mb-2">Nilai Turunan pada x = {x}</p>
                        <p className="font-mono text-3xl font-bold text-white">{derivativeValue.toFixed(3)}</p>
                    </div>
                     <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/30 animate-scale-in">
                        <p className="text-sm text-secondary font-semibold mb-2">Integral Tak Tentu</p>
                        <p className="font-mono text-xl font-bold">{integral}</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent to-accent-light p-6 rounded-xl shadow-lg animate-scale-in">
                        <p className="text-sm text-white/90 mb-2">Integral Tentu [{a}, {b}]</p>
                        <p className="font-mono text-3xl font-bold text-white">{definiteIntegral.toFixed(3)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatistikaPage = () => {
    const [dataInput, setDataInput] = useState('5, 8, 12, 15, 20, 22, 25');

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataInput(e.target.value);
    };

    const dataArray = useMemo(() => {
        return dataInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x)).sort((a, b) => a - b);
    }, [dataInput]);

    const mean = useMemo(() => {
        if (dataArray.length === 0) return 0;
        return dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    }, [dataArray]);

    const median = useMemo(() => {
        if (dataArray.length === 0) return 0;
        const mid = Math.floor(dataArray.length / 2);
        return dataArray.length % 2 === 0 ? (dataArray[mid - 1] + dataArray[mid]) / 2 : dataArray[mid];
    }, [dataArray]);

    const mode = useMemo(() => {
        if (dataArray.length === 0) return 'Tidak ada';
        const frequency: { [key: number]: number } = {};
        dataArray.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        
        const modes = Object.keys(frequency).filter(key => frequency[parseFloat(key)] === maxFreq);
        
        if (modes.length === Object.keys(frequency).length && maxFreq > 0) {
             if (maxFreq === 1) return 'Tidak ada';
        }
        if (modes.length === 0) return 'Tidak ada';

        return modes.join(', ');
    }, [dataArray]);

    const range = useMemo(() => {
        if (dataArray.length === 0) return 0;
        return dataArray[dataArray.length - 1] - dataArray[0];
    }, [dataArray]);

    const variance = useMemo(() => {
        if (dataArray.length === 0) return 0;
        const m = mean;
        const n = dataArray.length > 1 ? dataArray.length - 1 : 1;
        return dataArray.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / n;
    }, [dataArray, mean]);

    const stdDev = Math.sqrt(variance);

    return (
        <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Statistika Deskriptif</h2>
            </div>
            <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
              Masukkan data Anda yang dipisahkan koma untuk menghitung ukuran pemusatan dan penyebaran data.
            </p>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="glass-dark rounded-xl p-6 border border-white/10">
                    <label htmlFor="dataInput" className="block mb-3 text-sm font-semibold">
                      Data (pisahkan dengan koma)
                    </label>
                    <input 
                        type="text" 
                        id="dataInput"
                        value={dataInput} 
                        onChange={handleDataChange}
                        className="w-full px-4 py-3 bg-muted/50 border border-input rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Contoh: 5, 8, 12, 15, 20"
                    />
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">n:</span> {dataArray.length}
                      </span>
                      <span className="text-muted">|</span>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Terurut:</span> [{dataArray.join(', ')}]
                      </span>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-dark rounded-xl p-6 border border-primary/30 bg-primary/5">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          Ukuran Pemusatan
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Mean (Rata-rata)</p>
                                <p className="text-3xl font-bold text-primary">{mean.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Median (Nilai Tengah)</p>
                                <p className="text-3xl font-bold text-primary">{median.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Modus (Nilai Sering)</p>
                                <p className="text-3xl font-bold text-primary">{mode}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="glass-dark rounded-xl p-6 border border-secondary/30 bg-secondary/5">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                          Ukuran Penyebaran
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Range (Jangkauan)</p>
                                <p className="text-3xl font-bold text-secondary">{range.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Variance (Variansi, s²)</p>
                                <p className="text-3xl font-bold text-secondary">{variance.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground mb-1">Std. Deviation (Simpangan Baku, s)</p>
                                <p className="text-3xl font-bold text-secondary">{stdDev.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-dark p-6 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Penjelasan
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground">Mean:</span> Jumlah seluruh data dibagi banyaknya data.
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Median:</span> Nilai tengah setelah data diurutkan.
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Modus:</span> Nilai yang paling sering muncul.
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Range:</span> Selisih nilai terbesar dan terkecil.
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Variance:</span> Rata-rata kuadrat selisih data dengan mean (n-1).
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Std. Deviation:</span> Akar dari variance, sebaran data.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GeometryHomePage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="glass rounded-2xl p-8 text-center border border-white/20">
            <Shapes className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Jelajahi Dunia Geometri</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Pilih salah satu bangun datar atau bangun ruang di bawah ini untuk mempelajari rumus dan menghitung luas atau volumenya secara interaktif.
            </p>
        </div>
        
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full" />
                  <h3 className="text-2xl font-bold text-gradient-primary">Bangun Datar (2D)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {geometryData.filter(s => s.unit === 'Luas').map(shape => (
                        <button 
                            key={shape.id}
                            onClick={() => onNavigate(shape.id)}
                            className="group glass rounded-xl p-6 border border-white/20 hover:scale-105 hover:shadow-glow-md transition-all duration-300 text-center"
                        >
                            <Circle className="w-10 h-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {shape.title.replace('Luas ', '')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-secondary to-secondary-light rounded-full" />
                  <h3 className="text-2xl font-bold text-gradient-secondary">Bangun Ruang (3D)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {geometryData.filter(s => s.unit === 'Volume').map(shape => (
                        <button 
                            key={shape.id}
                            onClick={() => onNavigate(shape.id)}
                            className="group glass rounded-xl p-6 border border-white/20 hover:scale-105 hover:shadow-glow-md transition-all duration-300 text-center"
                        >
                            <Box className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-semibold group-hover:text-secondary transition-colors">
                              {shape.title.replace('Volume ', '')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const GeometryPage = ({ shapeConfig }: { shapeConfig: GeometryShape }) => {
  const [inputs, setInputs] = useState(() => 
    shapeConfig.inputs.reduce((acc, input) => ({ ...acc, [input.id]: '' }), {})
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const numericInputs = useMemo(() => {
    return Object.keys(inputs).reduce((acc, key) => {
      acc[key] = parseFloat(inputs[key]) || 0;
      return acc;
    }, {} as { [key: string]: number });
  }, [inputs]);

  const result = useMemo(() => {
    return shapeConfig.calculation(numericInputs);
  }, [numericInputs, shapeConfig]);

  const renderShape = () => {
    const { id } = shapeConfig;
    const commonClasses = "transition-all duration-500 ease-out transform hover:scale-110";
    const vizSize = 250;

    const maxInput = Math.max(...Object.values(numericInputs), 1);
    const scale = vizSize / (maxInput * 1.5);

    switch (id) {
      case 'lingkaran':
        const radiusL = Math.max(5, (numericInputs.radius || 0) * scale);
        return (
          <div 
               className={`${commonClasses} rounded-full`}
               style={{ 
                 width: `${radiusL*2}px`,
                 height: `${radiusL*2}px`,
                 background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--secondary) / 0.3))',
                 border: '3px solid hsl(var(--primary))',
                 boxShadow: '0 0 30px hsl(var(--primary) / 0.3)'
               }}>
          </div>
        );
      
      case 'persegi':
        const sideP = Math.max(5, (numericInputs.side || 0) * scale);
        return (
          <div 
               className={`${commonClasses} rounded-lg`}
               style={{ 
                 width: `${sideP}px`,
                 height: `${sideP}px`,
                 background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.3), hsl(var(--accent) / 0.3))',
                 border: '3px solid hsl(var(--secondary))',
                 boxShadow: '0 0 30px hsl(var(--secondary) / 0.3)'
               }}>
          </div>
        );
      
      case 'persegi-panjang':
        const widthPP = Math.max(5, (numericInputs.length || 0) * scale);
        const heightPP = Math.max(5, (numericInputs.width || 0) * scale);
        return (
          <div 
               className={`${commonClasses} rounded-lg`}
               style={{ 
                 width: `${widthPP}px`,
                 height: `${heightPP}px`,
                 background: 'linear-gradient(135deg, hsl(var(--accent) / 0.3), hsl(var(--primary) / 0.3))',
                 border: '3px solid hsl(var(--accent))',
                 boxShadow: '0 0 30px hsl(var(--accent) / 0.3)'
               }}>
          </div>
        );

      case 'segitiga':
        const baseT = Math.max(5, (numericInputs.base || 0) * scale);
        const heightT = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div style={{ width: `${baseT}px`, height: `${heightT}px` }} className={`${commonClasses} relative`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${baseT || 1} ${heightT || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="triangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: 'hsl(var(--secondary))', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              <polygon points={`${baseT / 2},0 0,${heightT} ${baseT},${heightT}`} fill="url(#triangleGrad)" stroke="hsl(var(--primary))" strokeWidth="3" />
            </svg>
          </div>
        );

      case 'jajaran-genjang':
        const baseJG = Math.max(5, (numericInputs.base || 0) * scale);
        const heightJG = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div 
               className={`${commonClasses} -skew-x-12 rounded-lg`}
               style={{ 
                 width: `${baseJG}px`,
                 height: `${heightJG}px`,
                 background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.3), hsl(var(--primary-light) / 0.3))',
                 border: '3px solid hsl(var(--secondary))',
                 boxShadow: '0 0 30px hsl(var(--secondary) / 0.3)'
               }}>
          </div>
        );
      
      case 'trapesium':
        const baseA = Math.max(1, (numericInputs.baseA || 0) * scale);
        const baseB = Math.max(5, (numericInputs.baseB || 0) * scale);
        const heightTr = Math.max(5, (numericInputs.height || 0) * scale);
        const diff = (baseB - baseA) / 2;
        return (
          <div style={{ width: `${baseB}px`, height: `${heightTr}px`}} className={`${commonClasses} relative`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${baseB || 1} ${heightTr || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="trapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: 'hsl(var(--accent-light))', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
               <polygon points={`${diff},0 ${baseB - diff},0 ${baseB},${heightTr} 0,${heightTr}`} fill="url(#trapGrad)" stroke="hsl(var(--accent))" strokeWidth="3" />
            </svg>
          </div>
        );

      case 'belah-ketupat':
        const d1BK = Math.max(5, (numericInputs.diagonal1 || 0) * scale);
        const d2BK = Math.max(5, (numericInputs.diagonal2 || 0) * scale);
        return (
            <div style={{ width: `${d1BK}px`, height: `${d2BK}px` }} className={`${commonClasses} relative`}>
                <svg width="100%" height="100%" viewBox={`0 0 ${d1BK || 1} ${d2BK || 1}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="rhombusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'hsl(var(--primary-light))', stopOpacity: 0.3}} />
                        <stop offset="100%" style={{stopColor: 'hsl(var(--secondary-light))', stopOpacity: 0.3}} />
                      </linearGradient>
                    </defs>
                    <polygon points={`${d1BK / 2},0 0,${d2BK / 2} ${d1BK / 2},${d2BK} ${d1BK},${d2BK / 2}`} fill="url(#rhombusGrad)" stroke="hsl(var(--primary-light))" strokeWidth="3" />
                </svg>
            </div>
        );

      case 'layang-layang':
        const d1LL = Math.max(5, (numericInputs.diagonal1 || 0) * scale);
        const d2LL = Math.max(5, (numericInputs.diagonal2 || 0) * scale);
        return (
          <div style={{ width: `${d1LL}px`, height: `${d2LL}px` }} className={`${commonClasses} relative`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${d1LL || 1} ${d2LL || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="kiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: 'hsl(var(--secondary))', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              <polygon points={`${d1LL / 2},0 0,${d2LL / 3} ${d1LL / 2},${d2LL} ${d1LL},${d2LL / 3}`} fill="url(#kiteGrad)" stroke="hsl(var(--accent))" strokeWidth="3" />
            </svg>
          </div>
        );

      case 'kubus':
        const sideK = Math.max(5, (numericInputs.side || 0) * scale);
        return (
          <div 
               className={`${commonClasses} rounded-xl`}
               style={{ 
                 width: `${sideK}px`,
                 height: `${sideK}px`,
                 background: 'linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary-dark) / 0.4))',
                 border: '3px solid hsl(var(--primary))',
                 boxShadow: '0 0 40px hsl(var(--primary) / 0.4), inset 0 0 30px hsl(var(--primary) / 0.2)'
               }}>
          </div>
        );
      
      case 'balok':
        const widthB = Math.max(5, (numericInputs.length || 0) * scale);
        const heightB = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div 
               className={`${commonClasses} rounded-xl`}
               style={{ 
                 width: `${widthB}px`,
                 height: `${heightB}px`,
                 background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.4), hsl(var(--secondary-light) / 0.4))',
                 border: '3px solid hsl(var(--secondary))',
                 boxShadow: '0 0 40px hsl(var(--secondary) / 0.4), inset 0 0 30px hsl(var(--secondary) / 0.2)'
               }}>
          </div>
        );

      case 'silinder':
         const diameterCyl = Math.max(5, (numericInputs.radius || 0) * scale * 2);
         const heightCyl = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div 
               className={`${commonClasses}`}
               style={{ 
                 width: `${diameterCyl}px`,
                 height: `${heightCyl}px`,
                 background: 'linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--accent-light) / 0.4))',
                 border: '3px solid hsl(var(--accent))',
                 borderRadius: '50% / 20px',
                 boxShadow: '0 0 40px hsl(var(--accent) / 0.4)'
               }}>
          </div>
        );

      case 'bola':
        const diameterB = Math.max(5, (numericInputs.radius || 0) * scale * 2);
        return (
          <div 
               className={`${commonClasses} rounded-full`}
               style={{ 
                 width: `${diameterB}px`,
                 height: `${diameterB}px`,
                 background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary-light)), hsl(var(--primary-dark)))',
                 border: '3px solid hsl(var(--primary))',
                 boxShadow: '0 0 50px hsl(var(--primary) / 0.5), inset 0 0 40px hsl(var(--primary) / 0.3)'
               }}>
          </div>
        );
      
      case 'kerucut':
        const baseC = Math.max(5, (numericInputs.radius || 0) * scale * 2);
        const heightC = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div style={{ width: `${baseC}px`, height: `${heightC}px` }} className={`${commonClasses} relative`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${baseC || 1} ${heightC || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="coneGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.5}} />
                  <stop offset="100%" style={{stopColor: 'hsl(var(--accent-light))', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              <polygon points={`${baseC / 2},0 0,${heightC} ${baseC},${heightC}`} fill="url(#coneGrad)" stroke="hsl(var(--accent))" strokeWidth="3" />
            </svg>
          </div>
        );

      case 'limas':
        const sideL = Math.max(5, (numericInputs.side || 0) * scale);
        const heightL = Math.max(5, (numericInputs.height || 0) * scale);
        return (
          <div style={{ width: `${sideL}px`, height: `${heightL}px` }} className={`${commonClasses} relative`}>
            <svg width="100%" height="100%" viewBox={`0 0 ${sideL || 1} ${heightL || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="pyramidGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(var(--secondary))', stopOpacity: 0.5}} />
                  <stop offset="100%" style={{stopColor: 'hsl(var(--secondary-light))', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              <polygon points={`${sideL / 2},0 0,${heightL} ${sideL},${heightL}`} fill="url(#pyramidGrad)" stroke="hsl(var(--secondary))" strokeWidth="3" />
              <line x1="0" y1={heightL} x2={sideL} y2={heightL} stroke="hsl(var(--secondary))" strokeWidth="2" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass rounded-2xl p-8 border border-white/20 animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        {shapeConfig.unit === 'Luas' ? (
          <Circle className="w-8 h-8 text-primary" />
        ) : (
          <Box className="w-8 h-8 text-secondary" />
        )}
        <h2 className="text-3xl font-bold">{shapeConfig.title}</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="glass-dark rounded-xl p-6 border border-white/10 space-y-4">
            {shapeConfig.inputs.map((input, index) => (
              <div key={input.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <label htmlFor={input.id} className="block mb-2 text-sm font-semibold text-foreground/80">
                  {input.label}
                </label>
                <input
                  type="number"
                  id={input.id}
                  name={input.id}
                  value={inputs[input.id]}
                  onChange={handleInputChange}
                  placeholder={input.placeholder}
                  className="w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            ))}
          </div>

          <div className="glass-dark rounded-xl p-6 border border-white/10 animate-scale-in">
            <p className="text-center text-sm text-muted-foreground mb-3">
              Hasil {shapeConfig.unit}
            </p>
            <div className={`p-6 rounded-xl shadow-glow-md ${
              shapeConfig.unit === 'Luas' 
                ? 'bg-gradient-to-br from-primary to-primary-light' 
                : 'bg-gradient-to-br from-secondary to-secondary-light'
            }`}>
                <p className="text-5xl font-bold font-mono text-white text-center mb-2">
                  {result.toFixed(3)}
                </p>
                <p className="text-sm text-white/80 text-center font-mono">
                  {shapeConfig.formula}
                </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-[280px] h-[280px] glass-dark rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10">
              {renderShape()}
            </div>
          </div>
          
          <div className="glass-dark p-6 rounded-xl border border-white/10 max-w-md">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {shapeConfig.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MathApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'trigonometri':
        return <TrigonometryPage />;
      case 'aljabar':
        return <AlgebraPage />;
      case 'kalkulus':
        return <KalkulusPage />;
      case 'statistika':
        return <StatistikaPage />;
      case 'geometri':
        return <GeometryHomePage onNavigate={setCurrentPage} />;
      
      default:
        const shapeConfig = geometryData.find(shape => shape.id === currentPage);
        if (shapeConfig) {
          return <GeometryPage shapeConfig={shapeConfig} />;
        }
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
        {renderCurrentPage()}
      </main>
      <footer className="text-center py-8 text-muted-foreground text-sm border-t border-border/50 mt-16">
        <p className="flex items-center justify-center gap-2">
          © 2025 Pusat Belajar Matematika
          <span className="text-primary">•</span>
          Dibuat untuk Pembelajaran Interaktif
        </p>
      </footer>
    </div>
  );
};

export default MathApp;
