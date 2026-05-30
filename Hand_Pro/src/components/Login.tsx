import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   Palette App — Login TSX
   #1F2A44  Navy bg
   #131c2f  Dark navy
   #E8DCC8  Beige text
   #C6A75E  Gold accent
───────────────────────────────────────────────────────── */

/* ── Types ───────────────────────────────────────────── */
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
  mouseX: number;
  mouseY: number;
}

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  mouseX: number;
  mouseY: number;
  forceLookX?: number;
  forceLookY?: number;
}

interface LoginProps {
  onLogin?: () => void;
  onForgotPassword?: () => void;
}

/* ── EyeBall ─────────────────────────────────────────── */
function EyeBall({
  size = 22,
  pupilSize = 9,
  maxDistance = 5,
  eyeColor = "#E8DCC8",
  pupilColor = "#1F2A44",
  isBlinking = false,
  forceLookX,
  forceLookY,
  mouseX,
  mouseY,
}: EyeBallProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      setOffset({ x: forceLookX, y: forceLookY });
      return;
    }
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = dist > 0 ? Math.min(maxDistance / dist, 1) : 0;
    setOffset({ x: dx * scale, y: dy * scale });
  }, [mouseX, mouseY, forceLookX, forceLookY, maxDistance]);

  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: isBlinking ? size * 0.12 : size,
        borderRadius: "50%",
        backgroundColor: eyeColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "height 0.08s ease",
        flexShrink: 0,
      }}
    >
      {!isBlinking && (
        <div
          style={{
            width: pupilSize,
            height: pupilSize,
            borderRadius: "50%",
            backgroundColor: pupilColor,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: "transform 0.05s ease-out",
          }}
        />
      )}
    </div>
  );
}

/* ── Pupil only (for gold characters) ───────────────── */
function Pupil({
  size = 14,
  maxDistance = 5,
  pupilColor = "#1F2A44",
  mouseX,
  mouseY,
  forceLookX,
  forceLookY,
}: PupilProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      setOffset({ x: forceLookX, y: forceLookY });
      return;
    }
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scale = dist > 0 ? Math.min(maxDistance / dist, 1) : 0;
    setOffset({ x: dx * scale, y: dy * scale });
  }, [mouseX, mouseY, forceLookX, forceLookY, maxDistance]);

  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: "50%",
          backgroundColor: pupilColor,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: "transform 0.05s ease-out",
        }}
      />
    </div>
  );
}

/* ── Main Login ───────────────────────────────────────── */
export default function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  const [hammerBlink, setHammerBlink] = useState<boolean>(false);
  const [sawBlink, setSawBlink] = useState<boolean>(false);
  const [lookTogether, setLookTogether] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  const hammerRef = useRef<HTMLDivElement>(null);
  const sawRef = useRef<HTMLDivElement>(null);
  const chiselRef = useRef<HTMLDivElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);

  /* Mouse */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* Blink */
  useEffect(() => {
    const blink = (set: React.Dispatch<React.SetStateAction<boolean>>): ReturnType<typeof setTimeout> => {
      const id = setTimeout(() => {
        set(true);
        setTimeout(() => {
          set(false);
          blink(set);
        }, 140);
      }, Math.random() * 4000 + 2500);
      return id;
    };
    const a = blink(setHammerBlink);
    const b = blink(setSawBlink);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  /* Look together on typing */
  useEffect(() => {
    if (isTyping) {
      setLookTogether(true);
      const t = setTimeout(() => setLookTogether(false), 700);
      return () => clearTimeout(t);
    }
    setLookTogether(false);
  }, [isTyping]);

  /* Peek when password visible */
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const id = setTimeout(() => {
        setIsPeeking(true);
        setTimeout(() => setIsPeeking(false), 700);
      }, Math.random() * 2500 + 1500);
      return () => clearTimeout(id);
    }
    setIsPeeking(false);
  }, [password, showPassword]);

  const [positions, setPositions] = useState({
    hPos: { faceX: 0, faceY: 0, bodySkew: 0 },
    sPos: { faceX: 0, faceY: 0, bodySkew: 0 },
    cPos: { faceX: 0, faceY: 0, bodySkew: 0 },
    rPos: { faceX: 0, faceY: 0, bodySkew: 0 },
  });

  useEffect(() => {
    const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 3;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      };
    };

    setPositions({
      hPos: calcPos(hammerRef),
      sPos: calcPos(sawRef),
      cPos: calcPos(chiselRef),
      rPos: calcPos(rollerRef),
    });
  }, [mouseX, mouseY, hammerRef, sawRef, chiselRef, rollerRef]);

  const { hPos, sPos, cPos, rPos } = positions;

  const pwHidden = password.length > 0 && !showPassword;
  const pwShown = password.length > 0 && showPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { api } = await import("../utils/api");
      const data = await api.login(email, password);

      // Store token for future authenticated requests
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      if (onLogin) onLogin();
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects.");
    }

    setIsLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(#C6A75E 1px,transparent 1px),linear-gradient(90deg,#C6A75E 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow top-right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 75% 20%, #C6A75E0A 0%, transparent 55%)",
        }}
      />
      {/* Glow bottom-left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 20% 85%, #C6A75E06 0%, transparent 45%)",
        }}
      />

      {/* ── CARD ──────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          margin: "1.5rem",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px #C6A75E20",
          background: "#ffffff",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(198,167,94,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          gap: "2rem",
        }}
      >
        {/* ── CHARACTER STAGE ─────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* tiny brand */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: "0.62rem",
              fontWeight: 900,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#f6e7c1",
            }}
          />

          {/* Characters */}
          <div style={{ position: "relative", width: 400, height: 240 }}>

            {/* MARTEAU */}
            <div
              ref={hammerRef}
              style={{
                position: "absolute",
                bottom: 0,
                left: 40,
                width: 130,
                height: pwHidden ? 310 : 270,
                zIndex: 1,
                cursor: "default",
                transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                transform: pwShown
                  ? "skewX(0deg)"
                  : pwHidden
                  ? `skewX(${(hPos.bodySkew || 0) - 10}deg) translateX(30px)`
                  : `skewX(${hPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              {/* Head */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 82,
                  borderRadius: "12px 12px 0 0",
                  background: "linear-gradient(90deg,#3a3a3a,#5c5c5c,#3a3a3a)",
                  borderBottom: "3px solid #1a1a1a",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "0.6rem",
                }}
              >
                <div style={{ height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.15)" }} />
                <span
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.25em",
                    fontWeight: 900,
                    textAlign: "center",
                    color: "#E8DCC840",
                    userSelect: "none",
                  }}
                >
                  MARTEAU
                </span>
              </div>
              {/* Handle */}
              <div
                style={{
                  position: "absolute",
                  top: 70,
                  bottom: 0,
                  left: "26%",
                  right: "26%",
                  borderRadius: "0 0 6px 6px",
                  background: "linear-gradient(180deg,#8B5E3C,#6B4423,#4a2f16)",
                  borderLeft: "3px solid #3a1f0a",
                  borderRight: "3px solid #3a1f0a",
                }}
              />
              {/* Eyes */}
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  gap: 22,
                  transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                  left: pwShown ? 14 : lookTogether ? 40 : 32 + hPos.faceX,
                  top: pwShown ? 24 : lookTogether ? 48 : 30 + hPos.faceY,
                }}
              >
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={4}
                  eyeColor="#E8DCC8"
                  pupilColor="#1F2A44"
                  isBlinking={hammerBlink}
                  forceLookX={pwShown ? (isPeeking ? 4 : -4) : lookTogether ? 3 : undefined}
                  forceLookY={pwShown ? (isPeeking ? 4 : -4) : lookTogether ? 3 : undefined}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={4}
                  eyeColor="#E8DCC8"
                  pupilColor="#1F2A44"
                  isBlinking={hammerBlink}
                  forceLookX={pwShown ? (isPeeking ? 4 : -4) : lookTogether ? 3 : undefined}
                  forceLookY={pwShown ? (isPeeking ? 4 : -4) : lookTogether ? 3 : undefined}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
              </div>
            </div>

            {/* SCIE */}
            <div
              ref={sawRef}
              style={{
                position: "absolute",
                bottom: 0,
                left: 160,
                width: 90,
                height: 230,
                zIndex: 2,
                cursor: "default",
                transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                transform: pwShown
                  ? "skewX(0deg)"
                  : lookTogether
                  ? `skewX(${(sPos.bodySkew || 0) * 1.4 + 8}deg) translateX(14px)`
                  : `skewX(${sPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  right: 6,
                  top: 0,
                  bottom: 48,
                  borderRadius: "6px 6px 0 0",
                  background: "linear-gradient(90deg,#c0c0c0,#dedede,#c0c0c0)",
                  border: "1px solid #aaa",
                  overflow: "hidden",
                  padding: "0.4rem",
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 900, color: "#1F2A44" }}>SCIE PRO</span>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 6,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  {Array(14)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderRight: "7px solid #1F2A44",
                        }}
                      />
                    ))}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 48,
                  borderRadius: "0 0 6px 6px",
                  background: "linear-gradient(180deg,#1F2A44,#131c2f)",
                  border: "3px solid #0d1520",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "rgba(198,167,94,0.2)",
                    border: "1px solid #C6A75E",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  gap: 18,
                  transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                  left: pwShown ? 8 : lookTogether ? 24 : 18 + sPos.faceX,
                  top: pwShown ? 20 : lookTogether ? 8 : 22 + sPos.faceY,
                }}
              >
                <EyeBall
                  size={15}
                  pupilSize={6}
                  maxDistance={3}
                  eyeColor="#E8DCC8"
                  pupilColor="#1F2A44"
                  isBlinking={sawBlink}
                  forceLookX={pwShown ? -3 : lookTogether ? -2 : undefined}
                  forceLookY={pwShown ? -3 : lookTogether ? -3 : undefined}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
                <EyeBall
                  size={15}
                  pupilSize={6}
                  maxDistance={3}
                  eyeColor="#E8DCC8"
                  pupilColor="#1F2A44"
                  isBlinking={sawBlink}
                  forceLookX={pwShown ? -3 : lookTogether ? -2 : undefined}
                  forceLookY={pwShown ? -3 : lookTogether ? -3 : undefined}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
              </div>
            </div>

            {/* CISEAU */}
            <div
              ref={chiselRef}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 180,
                height: 155,
                zIndex: 3,
                cursor: "default",
                transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                transform: pwShown
                  ? "skewX(-18deg) translateX(-20px)"
                  : `skewX(${cPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50% 50% 0 0",
                  background: "linear-gradient(135deg,#C6A75E,#a8873a,#8B6914)",
                  border: "3px solid #5a4010",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "0.75rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "34%",
                    right: "34%",
                    height: 18,
                    borderRadius: "3px 3px 0 0",
                    background: "linear-gradient(90deg,#d0d0d0,#eaeaea)",
                    border: "1px solid #aaa",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 5,
                      borderRadius: 2,
                      marginTop: 6,
                      background: "linear-gradient(90deg,#fff,#ccc)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 900,
                    textAlign: "center",
                    userSelect: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#1F2A44",
                  }}
                >
                  CISEAU
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  gap: 26,
                  transition: "all 0.2s ease-out",
                  left: pwShown ? 40 : 62 + (cPos.faceX || 0),
                  top: pwShown ? 55 : 70 + (cPos.faceY || 0),
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={4}
                  pupilColor="#1F2A44"
                  mouseX={mouseX}
                  mouseY={mouseY}
                  forceLookX={pwShown ? -6 : undefined}
                  forceLookY={pwShown ? -5 : undefined}
                />
                <Pupil
                  size={12}
                  maxDistance={4}
                  pupilColor="#1F2A44"
                  mouseX={mouseX}
                  mouseY={mouseY}
                  forceLookX={pwShown ? -6 : undefined}
                  forceLookY={pwShown ? -5 : undefined}
                />
              </div>
            </div>

            {/* ROULEAU */}
            <div
              ref={rollerRef}
              style={{
                position: "absolute",
                bottom: 0,
                left: 238,
                width: 115,
                height: 190,
                zIndex: 4,
                cursor: "default",
                transition: "all 0.65s cubic-bezier(.4,0,.2,1)",
                transform: pwShown
                  ? "skewX(0deg) translateX(0px)"
                  : `skewX(${rPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 130,
                  borderRadius: 20,
                  background: "linear-gradient(180deg,#E8DCC8,#d5c4a8)",
                  border: "3px solid #a89070",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                }}
              >
                <div
                  style={{
                    height: 16,
                    width: "100%",
                    borderRadius: 8,
                    backgroundColor: "rgba(198,167,94,0.45)",
                  }}
                />
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 900,
                    textAlign: "center",
                    userSelect: "none",
                    letterSpacing: "0.18em",
                    color: "#1F2A44",
                  }}
                >
                  PEINTRE
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 118,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 32,
                    borderRight: "3px solid #C6A75E",
                    borderBottom: "3px solid #C6A75E",
                    borderRadius: "0 0 6px 0",
                  }}
                />
                <div
                  style={{
                    width: 18,
                    flex: 1,
                    borderRadius: "0 0 4px 4px",
                    background: "linear-gradient(180deg,#1F2A44,#131c2f)",
                    border: "1px solid #0d1520",
                  }}
                />
              </div>

              {/* Roller eyes */}
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  gap: 20,
                  transition: "all 0.2s ease-out",
                  left: pwShown ? 25 : 42 + (rPos.faceX || 0),
                  top: pwShown ? 20 : 32 + (rPos.faceY || 0),
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={4}
                  pupilColor="#1F2A44"
                  mouseX={mouseX}
                  mouseY={mouseY}
                  forceLookX={pwShown ? -6 : undefined}
                  forceLookY={pwShown ? -5 : undefined}
                />
                <Pupil
                  size={12}
                  maxDistance={4}
                  pupilColor="#1F2A44"
                  mouseX={mouseX}
                  mouseY={mouseY}
                  forceLookX={pwShown ? -6 : undefined}
                  forceLookY={pwShown ? -5 : undefined}
                />
              </div>

              {/* Roller mouth */}
              <div
                style={{
                  position: "absolute",
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#1F2A44",
                  transition: "all 0.2s ease-out",
                  left: pwShown ? 20 : 30 + (rPos.faceX || 0),
                  top: pwShown ? 55 : 72 + (rPos.faceY || 0),
                }}
              />
            </div>
          </div>
        </div>

        {/* ── FORM AREA ────────────────── */}
        <div
          style={{
            flex: 1,
            maxWidth: 420,
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.18)",
            borderRadius: 20,
            padding: "2rem",
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "1.45rem",
                fontWeight: 900,
                textAlign: "center",
                color: "rgba(198,167,94,0.7)",
                letterSpacing: "-0.02em",
              }}
            >
              Connexion
            </h1>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.78rem",
                textAlign: "center",
                color: "#4B2E2A",
              }}
            >
              Accédez à votre espace — artisan ou client.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#C6A75E",
                  marginBottom: "0.35rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  setIsTyping(true);
                  e.target.style.borderColor = "#C6A75E";
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  setIsTyping(false);
                  e.target.style.borderColor = "rgba(198,167,94,0.25)";
                }}
                required
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 1rem",
                  borderRadius: 10,
                  border: "1px solid rgba(198,167,94,0.25)",
                  background: "rgba(255,255,255,0.07)",
                  color: "#E8DCC8",
                  fontSize: "0.88rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  backdropFilter: "blur(6px)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.35rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#C6A75E",
                  }}
                >
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onForgotPassword) onForgotPassword();
                  }}
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(198,167,94,0.7)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Oublié ?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = "#C6A75E")
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = "rgba(198,167,94,0.25)")
                  }
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 3rem 0 1rem",
                    borderRadius: 10,
                    border: "1px solid rgba(198,167,94,0.25)",
                    background: "rgba(255,255,255,0.07)",
                    color: "#E8DCC8",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    backdropFilter: "blur(6px)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(232,220,200,0.45)",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password state hint */}
              {password.length > 0 && (
                <p
                  style={{
                    margin: "0.3rem 0 0",
                    fontSize: "0.63rem",
                    color: "rgba(232,220,200,0.4)",
                  }}
                >
                  {showPassword
                    ? "👀 Les compagnons regardent !"
                    : "🙈 Les compagnons se cachent les yeux."}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: 8,
                  fontSize: "0.76rem",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "0.25rem",
                width: "100%",
                height: 46,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#C6A75E,#a8873a)",
                color: "#1F2A44",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: isLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isLoading ? 0.75 : 1,
                transition: "opacity 0.2s",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 18px rgba(198,167,94,0.25)",
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      border: "2px solid #1F2A44",
                      borderTopColor: "transparent",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{ flex: 1, height: 1, backgroundColor: "rgba(198,167,94,0.15)" }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "rgba(232,220,200,0.3)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                ou
              </span>
              <div
                style={{ flex: 1, height: 1, backgroundColor: "rgba(198,167,94,0.15)" }}
              />
            </div>
          </form>

          {/* Bottom note */}
          <p
            style={{
              margin: "1.25rem 0 0",
              textAlign: "center",
              fontSize: "0.7rem",
              color: "#4B2E2A",
            }}
          >
            Pas encore de compte ?{" "}
            <a
              href="#"
              style={{ color: "#C6A75E", fontWeight: 700, textDecoration: "none" }}
            >
              Créer un compte
            </a>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
