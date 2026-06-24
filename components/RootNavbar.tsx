import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { cn } from "~/lib/utils";

const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const user = useLoaderData();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isDetailPage = location.pathname === `/travel/${params.tripId}`;
    const solidNav = isDetailPage || scrolled;

    const handleLogout = async () => {
        await logoutUser();
        navigate("/sign-in");
    };

    return (
        <nav
            className={cn(
                "w-full fixed z-50 transition-all duration-300",
                solidNav
                    ? "bg-white/95 backdrop-blur-md shadow-100 border-b border-gray-200/60"
                    : "bg-transparent"
            )}
        >
            <header className="wrapper flex justify-between items-center h-16">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="Bay Travel logo"
                        className={cn("size-8 transition-all duration-300", !solidNav && "brightness-200")}
                    />
                    <span
                        className={cn(
                            "text-xl font-bold transition-colors duration-300",
                            solidNav ? "text-dark-100" : "text-white"
                        )}
                    >
                        Bay Travel
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {user?.status === "admin" && (
                        <Link
                            to="/dashboard"
                            className={cn(
                                "text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                                solidNav
                                    ? "text-dark-100 hover:text-primary-100 hover:bg-primary-50"
                                    : "text-white/90 hover:text-white hover:bg-white/15"
                            )}
                        >
                            Admin Panel
                        </Link>
                    )}

                    <img
                        src={user?.imageUrl || "/assets/images/david.webp"}
                        alt={user?.name || "user"}
                        referrerPolicy="no-referrer"
                        className={cn(
                            "size-9 rounded-full object-cover border-2 transition-all duration-300",
                            solidNav ? "border-gray-200" : "border-white/40"
                        )}
                    />

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer",
                            solidNav
                                ? "text-gray-500 hover:text-dark-100 hover:bg-light-300"
                                : "text-white/80 hover:text-white hover:bg-white/15"
                        )}
                    >
                        <img
                            src="/assets/icons/logout.svg"
                            alt="sign out"
                            className={cn("size-5 rotate-180 transition-all duration-300", !solidNav && "brightness-200")}
                        />
                        <span className="hidden md:inline">Sign out</span>
                    </button>
                </div>
            </header>
        </nav>
    );
};

export default RootNavbar;
