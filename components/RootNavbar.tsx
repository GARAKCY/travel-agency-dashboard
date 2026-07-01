import { Link, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const PlaneIcon = ({ size = 21, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: "block", flex: "none" }}>
        <path d="M21 15.5v-2l-8-4.5V3.5a1.5 1.5 0 0 0-3 0V9l-8 4.5v2l8-2.5V17l-2 1.5V20l3.5-1 3.5 1v-1.5L13 17v-4l8 2.5z" />
    </svg>
);

const RootNavbar = () => {
    const navigate = useNavigate();
    const user = useLoaderData();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/sign-in");
    };

    return (
        <nav style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            background: "#fff",
            borderBottom: "1px solid #eef2f7",
            position: "sticky",
            top: 0,
            zIndex: 50,
            fontFamily: "'Instrument Sans', system-ui, sans-serif",
        }}>
            {/* Left: brand + nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
                <Link to="/" style={{
                    display: "flex", alignItems: "center", gap: 9,
                    color: "#06c3d1",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800, fontSize: 23, letterSpacing: "-0.02em",
                    textDecoration: "none",
                }}>
                    <PlaneIcon color="#06c3d1" />
                    Bay Travel
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {[
                        { label: "Flights", active: true },
                        { label: "Stays", active: false },
                        { label: "Cars", active: false },
                        { label: "Packages", active: false },
                        { label: "Things to do", active: false },
                    ].map(({ label, active }) => (
                        <span key={label} style={{
                            color: active ? "#0f172a" : "#64748b",
                            fontWeight: active ? 600 : 500,
                            fontSize: 14,
                            cursor: "pointer",
                        }}>{label}</span>
                    ))}
                </div>
            </div>

            {/* Right: currency, support, user */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>USD $</span>
                <span style={{ color: "#64748b", fontWeight: 500, fontSize: 14 }}>Support</span>

                {user?.status === "admin" && (
                    <Link to="/dashboard" style={{
                        color: "#64748b", fontWeight: 500, fontSize: 14, textDecoration: "none",
                    }}>Admin</Link>
                )}

                {user?.imageUrl && (
                    <img
                        src={user.imageUrl}
                        alt={user.name || "user"}
                        referrerPolicy="no-referrer"
                        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                    />
                )}

                <button onClick={handleLogout} style={{
                    background: "#00FFEF",
                    color: "#053b42",
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "9px 20px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                }}>
                    {user?.name ? "Sign out" : "Sign in"}
                </button>
            </div>
        </nav>
    );
};

export default RootNavbar;
