import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  imageUrl: string;
  imageAlt: string;
}

interface Inspiration {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  colSpan: number;
  rowSpan: number;
}

interface Review {
  id: number;
  artisanName: string;
  project: string;
  rating: number;
  date: string;
  comment: string;
  icon: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const artisans: Artisan[] = [
  {
    id: 1,
    name: "Jean-Luc Moreau",
    specialty: "Ébéniste d'Art",
    rating: 5.0,
    imageAlt: "Ébéniste",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkyq9pjScSwMUNTwq8GtuVfKSBKSHsfMKpyQZwMXfRlyss3lKH4qf4qXbg0xGj_Dy2v97no9i1sZKhvLXNL08RIZSndwzBx2-78cncmnHfHCJmaYV4RsfOwd58bDIRsBi58vjytzoV6FyiylosiaTrBJDWRhlCvE-qZ-LvUEsZy1yHrKFBl-Paq5RXakCmHaAD24L5Pfrw0ag05aK4yNtmkTYBymniV8vMzFHkU-noduvAmVb03f5rV-0ELE4gcwYQHGYJRiBIM_M",
  },
  {
    id: 2,
    name: "Thomas Bernard",
    specialty: "Plombier Expert",
    rating: 4.8,
    imageAlt: "Plombier",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdO6K4TvV0kvJUW-3mpOGL51Sn3DCJntUC9RB9_NDlp-y1DygMmLCeCxRJ_KAAWLbGtCAIGgqwWwvEmkg_k5FqDALQMGjHgVsGSvaxSqSxYCbJMcqvZTswbZzsCtUg25o44KZXpauPbxBsNmoMbDfSqwNGq54-zGpuoDpLiD3vucnJBaSW0Mb_-1aTCU8lgqlx_2NxT9fnwIIEbBdUU9Pm6y0ED8RXN2juUw4BLCAQfUxtXizbsym26OnwYzHs-LeT_p-FKsEalI",
  },
  {
    id: 3,
    name: "Sophie Chevalier",
    specialty: "Maitre Tailleur",
    rating: 4.9,
    imageAlt: "Tailleur",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBH4eyBcOItHqSzDblbtM-EeLurfKuindHpO3LVzirtpbNeea1jaVKpioxEMAe6ZTFfESoiMTHMQ-GIpzUyqEv9872uvpjmebuk-cpFcrOsUMqaWUlZAidpB0Q4AylL-2ooB1XZuUX6wWNxja65SpLfYreFX61L1y1qn5b29u18VfPBvoB1DWdh-7NZgCuUMPSiJyw5W62aokXqo-qvhs3uLoZtLIcU4SP-AkEsSuNtzmzfYSnQhsZjJ4f4PNLpR8ZAwz6biiSH4tU",
  },
  {
    id: 4,
    name: "Luc Dujardin",
    specialty: "Ferronnier d'Art",
    rating: 4.7,
    imageAlt: "Ferronnier",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxzGs1ZiXkLo1ZfbAGQV3v_gkNppj3We7kFGHx9s8UVBndObdatXVeDgJ0NTirVcKirwY8MeaZZQeFulf6JBxsvP0hloDhQQ9y1dW8lG76upte07uEk1NOYLRgMu9Hv7BJjHb0to_eyktg6DqgoJYYjzzKx_dHpHaCZayNobtNfyHDP-fJjMdqzyho2Z1O09gPClR8hXMtJnIhSxZwkbcQ6eoY333zaKqom5voiPWUGE8KWIxLmbYK-yDEVnO-BN1Lc3Uw0a4YYj4",
  },
];

const inspirations: Inspiration[] = [
  {
    id: 1,
    title: "Table de Chêne Sculptée",
    category: "Mobiliers",
    colSpan: 2,
    rowSpan: 2,
    imageAlt: "Sculptural Table",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLokkk34I42AgpYADtBNTqC_Br5Ew7UlgGF03EK4Xws024Xz6MzX4a40zXz8T9FsOnmivdVJdgL3fPEV9csBy7tUhsKtsoCov3RPzNvD1O-BO58tqTHCaKb2OEUnGlUtl0g-Xl1gcugrVeYDkgxJM82kMeHCb-Bhv5zUrbBqRMRPjYR5qZQh6a1AhZwjgBaQUQK6f3awwMkFsE_b__Q2aOVt-IuXm86Vc13q_IlKSeE7QCgNxdFQ6LSbZj_LAH7g0ACkFmID6_YbY",
  },
  {
    id: 2,
    title: "Bibliothèque Sur Mesure",
    category: "Mobiliers",
    colSpan: 1,
    rowSpan: 1,
    imageAlt: "Bespoke Cabinetry",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBamjpAYXIOSSOWXHpwFuCiIkpOZHMFuuWFeX2FmiapwieHJEcF3mmMDEqusRu96RSHalVZF9BE7H_hjeQbcM_H6qMcMfFVqMu6fHP0LO-B9hGWNbB2Rl0Kda8IqekcCg_tP5awF7kKDkIlAnfZmWjXJGOfonPqliRQoiH_5axqeNUk1Qi788JTN-cpSfuFZSHejeD6vE97DqfmxpuTdpL2i1e10FRyCYBDdv7oF1O8x-MtoKobCaUGMdsJX2cGv-tBNiJHpHavDb8",
  },
  {
    id: 3,
    title: "Escalier Hélicoïdal",
    category: "Architecture",
    colSpan: 1,
    rowSpan: 2,
    imageAlt: "Staircase Detail",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVbuRw30t6WlZDUhsehqEZPM7y7sg1yE-NkxiMnzlh5NKPrvca_0tJk3cKhxhQF8_uO5GTay5qSWsa1G0EsROgowCZ5tqa7FYdGkWiyMHgNNWbzGR8tcPM7hn4S3dPDMPyrqj6LX_uHOAXVEzMZXg6I8A3aFT0FihIo9NWFLy306d39m7pMEPjjUP8Ubv3cDQ0oicxq10xhDaFxScnPhrT947v10S8lP4gCjsZPZ0NNSNYN8fZHsMdhLwEeQ5tMjumWheTYzA2uAc",
  },
  {
    id: 4,
    title: "Portail Forgé",
    category: "Architecture",
    colSpan: 1,
    rowSpan: 1,
    imageAlt: "Iron Gate",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmQhYso86J_-bw3SfKZ1g9UI42r3NqUsEJJCh8dxx6Lp-5vyN39rTXaOcny5qPo-CX8xgpwbt7xwiowd9GEQeSUYH4U0NyxzuQAkm1V2eWU8755b1GT427fMuJjcpo4cFEUyBEFGTd_gTIpiC7NfGvsQLDT8cv7--bgcukXFtPLW-wMgsOaanIjRAIcyS_7f-YAhV-f-Ph4ctb-hZU1XcTQcQJvrV-NgGNR6GPlNQ8-b3M8fHpWrrRMGEm-6WtgTltnSQ0aveGEFA",
  },
];

const reviews: Review[] = [
  {
    id: 1,
    artisanName: "Jean-Luc Moreau",
    project: "Projet : Table de Salle à Manger",
    rating: 5,
    date: "14 Octobre 2023",
    icon: "handyman",
    comment:
      "Un travail d'une finesse incroyable. Jean-Luc a su comprendre mes attentes dès le premier croquis. La table est devenue la pièce maîtresse de notre salon. Un véritable maître ébéniste.",
  },
  {
    id: 2,
    artisanName: "Thomas Bernard",
    project: "Projet : Rénovation Salle d'Eau",
    rating: 5,
    date: "02 Août 2023",
    icon: "plumbing",
    comment:
      "Très professionnel et ponctuel. Les finitions de la robinetterie encastrée sont parfaites. Chantier propre et conseils précieux pour l'entretien.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1 text-secondary">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined"
          style={{
            fontSize: size,
            fontVariationSettings: star <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <div className="glass-card p-6 rounded-xl transition-all duration-300 artisan-shadow hover-lift group">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-secondary/20 group-hover:border-secondary transition-colors">
        <img
          src={artisan.imageUrl}
          alt={artisan.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-headline-md text-xl text-primary mb-1">{artisan.name}</h3>
      <p className="font-body-md text-secondary mb-4">{artisan.specialty}</p>
      <div className="flex items-center gap-2">
        <StarRating rating={artisan.rating} />
        <span className="ml-1 text-on-surface-variant font-label-sm">{artisan.rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

function InspirationCard({ item }: { item: Inspiration }) {
  return (
    <div
      className="relative group overflow-hidden rounded-xl artisan-shadow"
      style={{
        gridColumn: `span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan}`,
      }}
    >
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div>
          {item.rowSpan > 1 && (
            <p className="font-label-sm text-secondary uppercase mb-1">{item.category}</p>
          )}
          <h4 className="font-headline-md text-lg text-white">{item.title}</h4>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="p-8 border border-outline-variant/30 rounded-xl glass-card transition-all hover:border-secondary/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined">{review.icon}</span>
          </div>
          <div>
            <h4 className="font-headline-md text-xl text-primary">{review.artisanName}</h4>
            <p className="font-label-sm text-on-surface-variant">{review.project}</p>
          </div>
        </div>
        <div className="flex flex-col md:items-end">
          <StarRating rating={review.rating} size={16} />
          <time className="font-label-sm text-on-surface-variant mt-1">{review.date}</time>
        </div>
      </div>
      <p className="font-body-md text-on-surface italic leading-relaxed">"{review.comment}"</p>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FILTER_OPTIONS = ["Tous", "Mobilier", "Architecture"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

export function ProfilClient() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Tous");

  const filteredInspirations = inspirations.filter((item) => {
    if (activeFilter === "Tous") return true;
    return item.category === activeFilter;
  });

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        .profil-client-container { background-color: #F5EDE0; color: #221b04; font-family: 'Manrope', sans-serif; overflow-x: hidden; min-height: 100vh; width: 100%; }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(232, 220, 200, 0.5);
        }

        .artisan-shadow {
          box-shadow: 0 10px 30px -15px rgba(31, 42, 68, 0.15);
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(31, 42, 68, 0.25);
          border-color: #745b19;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F5EDE0; }
        ::-webkit-scrollbar-thumb { background: #e8d9b4; border-radius: 10px; }
      `}</style>

      <div className="profil-client-container">
        <main
          style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 96,
        }}
      >
        {/* ── Profile Header ─────────────────────────────────────────── */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: 32,
            borderBottom: "1px solid rgba(198,198,206,0.3)",
            paddingBottom: 48,
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              className="artisan-shadow"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid white",
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtS9WuqQa1j0WrPOCv9yLviEpIbVbolJxvJO6f6kIQJBb--UyOtsfN8OqgAEpSStigqBMft8noUNvY1puIEDGDJLjnWZG-y12fhDsQxTsqR3M6rwy7NiP8DB8pRMsB2u4eIJmqhNLiRk7brdA3TAxpd6aZ7iQryBBj-wYzEqqaY2cn0n80frnIkOkGrE2_-0OOGVEmyOMxsr_0nCDXI3hWph6k7UnfgrBdNcetWDehCZ3Z4U3q2hFpci16Du0jGpAMCr_3qV2pO64"
                alt="Marc Lefebvre"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <button
              className="artisan-shadow"
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                background: "#745b19",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 56,
                fontWeight: 600,
                color: "#09152e",
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              Marc Lefebvre
            </h1>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 18,
                color: "#45464d",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#745b19" }}
              >
                verified_user
              </span>
              Membre depuis Janvier 2023
            </p>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["Collectionneur d'Art", "12 Projets Réalisés"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "6px 16px",
                    background: "#f6e7c1",
                    color: "#45464d",
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "Manrope, sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Edit button */}
          <button
            style={{
              border: "1px solid #745b19",
              color: "#745b19",
              background: "transparent",
              padding: "12px 32px",
              borderRadius: 9999,
              fontFamily: "Manrope, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(116,91,25,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Modifier Profil
          </button>
        </section>

        {/* ── Artisans Favoris ────────────────────────────────────────── */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#745b19",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Curated List
              </span>
              <h2
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 40,
                  fontWeight: 500,
                  color: "#09152e",
                }}
              >
                Artisans Favoris
              </h2>
            </div>
            <a
              href="#"
              style={{
                color: "#745b19",
                fontFamily: "Manrope, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Voir Tout{" "}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 32,
            }}
          >
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </section>

        {/* ── Mes Inspirations ────────────────────────────────────────── */}
        <section>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#745b19",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Portfolio Picks
              </span>
              <h2
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 40,
                  fontWeight: 500,
                  color: "#09152e",
                }}
              >
                Mes Inspirations
              </h2>
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 16 }}>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 9999,
                    border: "none",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: activeFilter === opt ? "#fcedc7" : "transparent",
                    color: activeFilter === opt ? "#221b04" : "#45464d",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Bento grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridAutoRows: 300,
              gap: 24,
            }}
          >
            {filteredInspirations.map((item) => (
              <InspirationCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ── Commentaires & Avis ─────────────────────────────────────── */}
        <section style={{ maxWidth: 896 }}>
          <div style={{ marginBottom: 40 }}>
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#745b19",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Feedback History
            </span>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 40,
                fontWeight: 500,
                color: "#09152e",
              }}
            >
              Commentaires &amp; Avis
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
