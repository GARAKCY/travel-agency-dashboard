import { Link, type LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "../../../.react-router/types/app/routes/admin/+types/trips";

// ─── Static data ────────────────────────────────────────────────────────────

const DESTINATIONS = [
    { id: "paris",     city: "Paris",      country: "France",    dur: "10h 55m", price: "$612", stops: "Nonstop", img: "/assets/images/card-img-2.png" },
    { id: "tokyo",     city: "Tokyo",      country: "Japan",     dur: "11h 20m", price: "$744", stops: "Nonstop", img: "/assets/images/card-img-5.png" },
    { id: "barcelona", city: "Barcelona",  country: "Spain",     dur: "13h 05m", price: "$538", stops: "1 stop",  img: "/assets/images/card-img-1.png" },
    { id: "newyork",   city: "New York",   country: "USA",       dur: "5h 30m",  price: "$212", stops: "Nonstop", img: "/assets/images/card-img-4.png" },
    { id: "reykjavik", city: "Reykjavík",  country: "Iceland",   dur: "9h 15m",  price: "$466", stops: "1 stop",  img: "/assets/images/card-img-3.png" },
    { id: "bali",      city: "Bali",       country: "Indonesia", dur: "19h 40m", price: "$898", stops: "1 stop",  img: "/assets/images/card-img-6.png" },
];

const STAYS = [
    { id: 1, name: "Hôtel Rivoli Left Bank",  area: "Saint-Germain", dist: "0.4 mi to center", badge: "9.4 · Superb",      price: "$184", img: "/assets/images/card-img-2.png" },
    { id: 2, name: "Maison Marais Boutique",  area: "Le Marais",     dist: "0.6 mi to center", badge: "9.1 · Superb",      price: "$156", img: "/assets/images/card-img-1.png" },
    { id: 3, name: "The Seine Grand Palace",  area: "Louvre",        dist: "0.2 mi to center", badge: "9.6 · Exceptional", price: "$312", img: "/assets/images/card-img-4.png" },
    { id: 4, name: "Montmartre View Loft",    area: "Montmartre",    dist: "1.1 mi to center", badge: "8.9 · Fabulous",    price: "$142", img: "/assets/images/card-img-6.png" },
];

const DEALS = [
    { code: "AX", color: "#0ea5b7", airline: "Aerolux · Nonstop",    route: "SFO → CDG", dates: "Jul 14 – 22", price: "$612" },
    { code: "NV", color: "#17b6c9", airline: "NovaAir · Nonstop",     route: "SFO → JFK", dates: "Aug 3 – 9",  price: "$212" },
    { code: "PB", color: "#0a5b64", airline: "Pacific Blue · 1 stop", route: "SFO → NRT", dates: "Sep 12 – 24",price: "$744" },
];

const DEMO_TRIPS: Trip[] = [
    { id: "demo-1", name: "Barcelona Cultural Experience", imageUrls: ["/assets/images/card-img-1.png"], itinerary: [{ day: 1, location: "Barcelona, Spain", activities: [] }], interests: "Culture & Art", travelStyle: "City Explorer", estimatedPrice: "$1,200", duration: 7, country: "Spain", groupType: "Solo", budget: "Moderate", description: "", bestTimeToVisit: [], weatherInfo: [] },
    { id: "demo-2", name: "London City Escape",            imageUrls: ["/assets/images/card-img-2.png"], itinerary: [{ day: 1, location: "London, UK",        activities: [] }], interests: "History", travelStyle: "Classic Tourist", estimatedPrice: "$1,800", duration: 5, country: "United Kingdom", groupType: "Couple", budget: "Moderate", description: "", bestTimeToVisit: [], weatherInfo: [] },
    { id: "demo-3", name: "Australia Adventure Tour",      imageUrls: ["/assets/images/card-img-3.png"], itinerary: [{ day: 1, location: "Sydney, Australia",  activities: [] }], interests: "Adventure", travelStyle: "Backpacker", estimatedPrice: "$3,500", duration: 14, country: "Australia", groupType: "Group", budget: "Luxury", description: "", bestTimeToVisit: [], weatherInfo: [] },
    { id: "demo-4", name: "Spain Golden Route",            imageUrls: ["/assets/images/card-img-4.png"], itinerary: [{ day: 1, location: "Madrid, Spain",      activities: [] }], interests: "Food & Wine", travelStyle: "Luxury", estimatedPrice: "$2,200", duration: 10, country: "Spain", groupType: "Couple", budget: "Luxury", description: "", bestTimeToVisit: [], weatherInfo: [] },
    { id: "demo-5", name: "Japan Cherry Blossom Trail",    imageUrls: ["/assets/images/card-img-5.png"], itinerary: [{ day: 1, location: "Tokyo, Japan",       activities: [] }], interests: "Nature", travelStyle: "Cultural", estimatedPrice: "$2,800", duration: 12, country: "Japan", groupType: "Solo", budget: "Moderate", description: "", bestTimeToVisit: [], weatherInfo: [] },
    { id: "demo-6", name: "Italy Grand Tour",              imageUrls: ["/assets/images/card-img-6.png"], itinerary: [{ day: 1, location: "Rome, Italy",        activities: [] }], interests: "Art", travelStyle: "Classic", estimatedPrice: "$2,500", duration: 10, country: "Italy", groupType: "Family", budget: "Moderate", description: "", bestTimeToVisit: [], weatherInfo: [] },
];

// ─── Loader ─────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
    if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
        return { trips: DEMO_TRIPS, total: DEMO_TRIPS.length };
    }
    try {
        const { allTrips, total } = await getAllTrips(8, 0);
        return {
            trips: allTrips.map(({ $id, tripDetails, imageUrls }: { $id: string; tripDetails: string; imageUrls: string[] }) => ({
                id: $id,
                ...parseTripData(tripDetails),
                imageUrls: imageUrls ?? [],
            })),
            total,
        };
    } catch {
        return { trips: DEMO_TRIPS, total: DEMO_TRIPS.length };
    }
};

// ─── SVG helpers ────────────────────────────────────────────────────────────

const PlaneIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: "block", flexShrink: 0 }}>
        <path d="M21 15.5v-2l-8-4.5V3.5a1.5 1.5 0 0 0-3 0V9l-8 4.5v2l8-2.5V17l-2 1.5V20l3.5-1 3.5 1v-1.5L13 17v-4l8 2.5z" />
    </svg>
);

const SendIcon = () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9z" />
    </svg>
);

const SwapIcon = () => (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" />
    </svg>
);

// ─── Search widget tabs ──────────────────────────────────────────────────────

const SEARCH_TABS = [
    { id: "flights",  label: "Flights",  icon: <PlaneIcon /> },
    { id: "stays",    label: "Stays",    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg> },
    { id: "cars",     label: "Cars",     icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg> },
    { id: "packages", label: "Packages", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/><path d="M10 20h4"/><circle cx="8" cy="20" r="1"/><circle cx="16" cy="20" r="1"/></svg> },
];

// ─── Component ───────────────────────────────────────────────────────────────

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const [activeTab, setActiveTab] = useState("flights");
    const [tripType, setTripType] = useState("roundtrip");

    const s = {
        page: { fontFamily: "'Instrument Sans', system-ui, sans-serif" } as React.CSSProperties,

        // hero
        heroWrap: { position: "relative", minHeight: 560, overflow: "hidden" } as React.CSSProperties,
        heroBg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as React.CSSProperties,
        heroOverlay: {
            position: "absolute", inset: 0,
            background: "radial-gradient(700px 340px at 78% 8%,rgba(0,255,239,.34),transparent 62%),linear-gradient(180deg,rgba(5,118,130,.94) 0%,rgba(9,168,180,.86) 42%,rgba(6,140,152,.88) 70%,rgba(3,74,82,.96) 100%)",
        } as React.CSSProperties,
        heroContent: { position: "relative", padding: "52px 48px 0" } as React.CSSProperties,

        // section
        sectionWrap: (bg = "#fff"): React.CSSProperties => ({
            background: bg,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 44px 100px -36px rgba(8,145,178,.42)",
            border: "1px solid rgba(8,145,178,.06)",
            margin: "0 auto",
            maxWidth: 1240,
        }),
    };

    return (
        <main style={s.page}>
            <div style={{ padding: "32px 24px 48px", maxWidth: 1288, margin: "0 auto" }}>
                <div style={s.sectionWrap()}>

                    {/* ── Hero ── */}
                    <div style={s.heroWrap}>
                        <img src="/assets/images/hero-img.png" alt="hero" style={s.heroBg} />
                        <div style={s.heroOverlay} />

                        <div style={s.heroContent}>
                            <div style={{ color: "#a5e4ee", fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", marginBottom: 14 }}>
                                FLIGHTS · STAYS · PACKAGES
                            </div>
                            <h1 style={{
                                margin: 0, color: "#fff",
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontWeight: 800, fontSize: 58, lineHeight: 1.02,
                                letterSpacing: "-0.03em", maxWidth: 720,
                            }}>
                                Your next adventure,<br />all in one place.
                            </h1>
                            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.85)", fontSize: 18, maxWidth: 540, lineHeight: 1.5 }}>
                                Search millions of flights and stays, compare live prices, and book the whole trip in a few taps.
                            </p>
                        </div>

                        {/* Search widget */}
                        <div style={{
                            position: "relative", margin: "36px 40px 0",
                            background: "#fff", borderRadius: 22,
                            boxShadow: "0 30px 60px -20px rgba(6,66,80,.5)",
                            padding: "8px 8px 18px",
                        }}>
                            {/* Tabs */}
                            <div style={{ display: "flex", gap: 4, padding: "8px 8px 0" }}>
                                {SEARCH_TABS.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "11px 20px", borderRadius: 12, border: "none",
                                        background: activeTab === tab.id ? "#e2f5f8" : "transparent",
                                        color: activeTab === tab.id ? "#06c3d1" : "#64748b",
                                        fontWeight: activeTab === tab.id ? 700 : 600,
                                        fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                                    }}>
                                        {tab.icon}{tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Trip type */}
                            <div style={{ display: "flex", gap: 16, padding: "12px 12px 0" }}>
                                {[{ id: "roundtrip", label: "Round-trip" }, { id: "oneway", label: "One-way" }, { id: "stay", label: "Add a place to stay" }].map(opt => (
                                    <button key={opt.id} onClick={() => setTripType(opt.id)} style={{
                                        display: "flex", alignItems: "center", gap: 7,
                                        color: tripType === opt.id ? "#06c3d1" : "#94a3b8",
                                        fontWeight: 600, fontSize: 13, background: "none", border: "none",
                                        cursor: "pointer", fontFamily: "inherit", padding: 0,
                                    }}>
                                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                                            {tripType === opt.id
                                                ? <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></>
                                                : <circle cx="12" cy="12" r="9" />
                                            }
                                        </svg>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Fields */}
                            <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap", padding: "14px 12px 0" }}>
                                <Field label="Leaving from" value="San Francisco (SFO)" flex={1.3} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, alignSelf: "center", borderRadius: "50%", background: "#e2f5f8", color: "#0a5b64" }}>
                                    <SwapIcon />
                                </div>
                                <Field label="Going to" value="Paris (CDG)" flex={1.3} />
                                <Field label="Dates" value="Jul 14 – 22" flex={1} />
                                <Field label="Travelers" value="1 Adult" flex={1} />
                                <button style={{
                                    border: "none", cursor: "pointer",
                                    background: "#f2663c", color: "#fff",
                                    borderRadius: 14, padding: "0 32px",
                                    fontFamily: "inherit", fontWeight: 700, fontSize: 16,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}>
                                    Search <SendIcon />
                                </button>
                            </div>
                        </div>

                        <div style={{ position: "relative", height: 28 }} />
                    </div>

                    {/* ── Trust strip ── */}
                    <div style={{
                        display: "flex", justifyContent: "center", gap: 44, flexWrap: "wrap",
                        padding: "18px 40px", background: "#f6f9fc", borderBottom: "1px solid #eef2f7",
                    }}>
                        {["✓ Free cancellation on most stays", "✓ Price-drop protection", "✓ No hidden booking fees", "✓ 24/7 traveler support"].map(t => (
                            <span key={t} style={{ color: "#334155", fontSize: 13, fontWeight: 600 }}>{t}</span>
                        ))}
                    </div>

                    {/* ── Popular destinations ── */}
                    <div style={{ padding: "44px 44px 8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                            <div>
                                <h2 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                                    Popular destinations
                                </h2>
                                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 15 }}>Round-trip fares · updated hourly</p>
                            </div>
                            <span style={{ color: "#06c3d1", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>See all destinations →</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
                            {DESTINATIONS.map(d => (
                                <div key={d.id} style={{ borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 12px 30px -18px rgba(8,145,178,.35)", border: "1px solid #eef2f7", cursor: "pointer" }}>
                                    <div style={{ position: "relative", height: 200 }}>
                                        <img src={d.img} alt={d.city} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,.92)", color: "#0a5b64", fontWeight: 700, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
                                            {d.stops}
                                        </span>
                                    </div>
                                    <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                        <div>
                                            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 19, fontWeight: 700, color: "#0f172a" }}>{d.city}</div>
                                            <div style={{ fontSize: 13, color: "#94a3b8" }}>{d.country} · {d.dur}</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>from</div>
                                            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#f2663c" }}>{d.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Top-rated stays ── */}
                    <div style={{ padding: "40px 44px 8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                            <div>
                                <h2 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                                    Top-rated stays in Paris
                                </h2>
                                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 15 }}>Handpicked hotels near where you're headed</p>
                            </div>
                            <span style={{ color: "#06c3d1", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Browse all stays →</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                            {STAYS.map(stay => (
                                <div key={stay.id} style={{ borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 12px 30px -18px rgba(8,145,178,.35)", border: "1px solid #eef2f7", cursor: "pointer" }}>
                                    <div style={{ position: "relative", height: 170 }}>
                                        <img src={stay.img} alt={stay.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                        <span style={{ position: "absolute", top: 10, right: 10, background: "#00FFEF", color: "#053b42", fontWeight: 700, fontSize: 12, padding: "5px 10px", borderRadius: 8 }}>
                                            {stay.badge}
                                        </span>
                                    </div>
                                    <div style={{ padding: "15px 16px 18px" }}>
                                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{stay.name}</div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{stay.area} · {stay.dist}</div>
                                        <div style={{ color: "#eab308", fontSize: 13, marginTop: 8 }}>★★★★★</div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 10 }}>
                                            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: "#f2663c" }}>{stay.price}</span>
                                            <span style={{ fontSize: 12, color: "#94a3b8" }}>/ night</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Flight deals band ── */}
                    <div style={{
                        marginTop: 40, padding: 44,
                        background: "radial-gradient(900px 400px at 85% -20%,rgba(0,255,239,.30),transparent 60%),linear-gradient(150deg,#065f6b,#0d8f9e)",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
                            <div>
                                <h2 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                                    Flight deals this week
                                </h2>
                                <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,.7)", fontSize: 15 }}>Round-trip · limited seats at these fares</p>
                            </div>
                            <span style={{ color: "#a5e4ee", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>View all deals →</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                            {DEALS.map(deal => (
                                <div key={deal.code} style={{
                                    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
                                    borderRadius: 16, padding: "20px 22px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    cursor: "pointer",
                                }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                            <span style={{
                                                width: 26, height: 26, borderRadius: 8,
                                                background: deal.color,
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontSize: 11, fontWeight: 700,
                                            }}>{deal.code}</span>
                                            <span style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>{deal.airline}</span>
                                        </div>
                                        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{deal.route}</div>
                                        <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12, marginTop: 2 }}>{deal.dates}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>from</div>
                                        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: "#ff8a5c" }}>{deal.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div style={{ background: "#062a30", padding: "44px 44px 32px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 40, flexWrap: "wrap", paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                            <div style={{ maxWidth: 280 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 12 }}>
                                    <PlaneIcon size={20} color="#2dc0d6" />
                                    Bay Travel
                                </div>
                                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                                    Compare flights, stays and packages across the world's airlines and hotels — one search, best price.
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
                                {[
                                    { title: "Company", links: ["About", "Careers", "Press"] },
                                    { title: "Support",  links: ["Help center", "Manage booking", "Cancellations"] },
                                    { title: "Explore",  links: ["Flights", "Hotels", "Packages"] },
                                ].map(col => (
                                    <div key={col.title}>
                                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{col.title}</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                                            {col.links.map(l => (
                                                <Link key={l} to="/" style={{ color: "rgba(255,255,255,.55)", fontSize: 13, textDecoration: "none" }}>{l}</Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ paddingTop: 20, color: "rgba(255,255,255,.4)", fontSize: 12 }}>
                            © 2026 Bay Travel. Fares shown are estimates and subject to availability.
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

// ─── Reusable field ───────────────────────────────────────────────────────────

const Field = ({ label, value, flex }: { label: string; value: string; flex: number }) => (
    <div style={{ flex, minWidth: 130, padding: "12px 16px", borderRadius: 14, background: "#f6f9fc", border: "1px solid #eef2f7" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 16, color: "#0f172a", fontWeight: 600, marginTop: 3 }}>{value}</div>
    </div>
);

export default TravelPage;
