import { Link, type LoaderFunctionArgs, useSearchParams } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { cn, parseTripData } from "~/lib/utils";
import { TripCard } from "../../../components";
import { getAllTrips } from "~/appwrite/trips";
import type { Route } from "../../../.react-router/types/app/routes/admin/+types/trips";
import { useState } from "react";
import { getUser } from "~/appwrite/auth";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

const FeaturedDestination = ({
    containerClass = "",
    bigCard = false,
    rating,
    title,
    activityCount,
    bgImage,
}: DestinationProps) => (
    <section
        className={cn(
            "rounded-[20px] overflow-hidden bg-cover bg-center size-full min-w-[280px] group cursor-pointer",
            containerClass,
            bgImage
        )}
    >
        <div className="bg-linear200 h-full transition-all duration-400 group-hover:brightness-110">
            <article className="featured-card">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full font-semibold text-white w-fit py-1 px-3 text-sm">
                    <span className="text-yellow-300">★</span>
                    <span>{rating}</span>
                </div>

                <article className="flex flex-col gap-3.5">
                    <h2
                        className={cn("text-lg font-bold text-white drop-shadow-md", {
                            "p-30-bold": bigCard,
                        })}
                    >
                        {title}
                    </h2>

                    <figure className="flex gap-2 items-center">
                        <div
                            className={cn(
                                "rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white",
                                bigCard ? "size-9 text-base" : "size-6 text-xs"
                            )}
                        >
                            ✈
                        </div>
                        <p
                            className={cn("font-medium text-white/90", {
                                "text-xs": !bigCard,
                                "text-base": bigCard,
                            })}
                        >
                            {activityCount} activities
                        </p>
                    </figure>
                </article>
            </article>
        </div>
    </section>
);

const StatItem = ({ number, label }: { number: string; label: string }) => (
    <div className="stat-item">
        <span className="stat-number">{number}</span>
        <span className="stat-label">{label}</span>
    </div>
);

const StepCard = ({
    step,
    icon,
    title,
    description,
}: {
    step: string;
    icon: string;
    title: string;
    description: string;
}) => (
    <div className="step-card">
        <div className="step-icon">{icon}</div>
        <div className="flex flex-col gap-2">
            <span className="step-badge">Step {step}</span>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </div>
);

const TestimonialCard = ({
    quote,
    name,
    location,
    avatar,
}: {
    quote: string;
    name: string;
    location: string;
    avatar: string;
}) => (
    <div className="testimonial-card">
        <div className="stars">
            {Array(5)
                .fill(null)
                .map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                        ★
                    </span>
                ))}
        </div>
        <blockquote>"{quote}"</blockquote>
        <div className="author">
            <img src={avatar} alt={name} />
            <div className="author-info">
                <h4>{name}</h4>
                <p>{location}</p>
            </div>
        </div>
    </div>
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const [user, { allTrips, total }] = await Promise.all([
        getUser(),
        getAllTrips(limit, offset),
    ]);

    return {
        trips: allTrips.map(({ $id, tripDetails, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? [],
        })),
        total,
    };
};

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];

    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    };

    return (
        <main className="flex flex-col">
            {/* ── Hero ── */}
            <section className="travel-hero">
                <div>
                    <section className="wrapper">
                        <article>
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2">
                                <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-white text-sm font-medium">
                                    500+ Happy Travelers This Month
                                </span>
                            </div>

                            <h1 className="p-72-bold text-white drop-shadow-lg leading-tight">
                                Discover Your
                                <span className="block text-sky-300"> Next Adventure</span>
                            </h1>

                            <p>
                                Plan unforgettable journeys with AI-powered itineraries tailored
                                to your style — from hidden gems to iconic landmarks.
                            </p>
                        </article>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="#trips">
                                <ButtonComponent
                                    type="button"
                                    className="button-class !h-12 !w-full sm:!w-[200px]"
                                >
                                    <span className="p-16-semibold text-white">Explore Trips</span>
                                    <span className="text-white text-lg">→</span>
                                </ButtonComponent>
                            </Link>
                            <Link to="#featured">
                                <button className="h-12 w-full sm:w-[200px] rounded-lg border border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer">
                                    View Destinations
                                </button>
                            </Link>
                        </div>
                    </section>
                </div>
            </section>

            {/* ── Stats ── */}
            <div className="stats-bar">
                <div className="wrapper">
                    <div className="stats-grid">
                        <StatItem number="500+" label="Curated Trips" />
                        <StatItem number="80+" label="Destinations" />
                        <StatItem number="10K+" label="Happy Travelers" />
                        <StatItem number="4.9★" label="Average Rating" />
                    </div>
                </div>
            </div>

            {/* ── Featured Destinations ── */}
            <section id="featured" className="pt-24 pb-16 wrapper flex flex-col gap-12">
                <div className="section-heading">
                    <span className="section-label">Where to go</span>
                    <h2>Featured Travel Destinations</h2>
                    <p>
                        Explore handpicked destinations loved by thousands of travelers
                        worldwide
                    </p>
                </div>

                <div className="featured">
                    <article>
                        <FeaturedDestination
                            bgImage="bg-card-1"
                            containerClass="h-1/3 lg:h-1/2"
                            bigCard
                            title="Barcelona Tour"
                            rating={4.2}
                            activityCount={196}
                        />
                        <div className="travel-featured">
                            <FeaturedDestination
                                bgImage="bg-card-2"
                                bigCard
                                title="London"
                                rating={4.5}
                                activityCount={512}
                            />
                            <FeaturedDestination
                                bgImage="bg-card-3"
                                bigCard
                                title="Australia Tour"
                                rating={3.5}
                                activityCount={250}
                            />
                        </div>
                    </article>

                    <div className="flex flex-col gap-[30px]">
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-4"
                            title="Spain Tour"
                            rating={3.8}
                            activityCount={150}
                        />
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-5"
                            title="Japan"
                            rating={5}
                            activityCount={150}
                        />
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-6"
                            title="Italy Tour"
                            rating={4.2}
                            activityCount={500}
                        />
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="how-it-works">
                <div className="wrapper flex flex-col">
                    <div className="section-heading">
                        <span className="section-label">Simple Process</span>
                        <h2>Plan Your Trip in 3 Easy Steps</h2>
                        <p>
                            Our AI-powered platform makes travel planning effortless and
                            deeply personalized
                        </p>
                    </div>
                    <div className="steps-grid">
                        <StepCard
                            step="01"
                            icon="🗺️"
                            title="Choose Destination"
                            description="Browse our curated collection or let AI suggest the perfect destination based on your travel preferences and interests."
                        />
                        <StepCard
                            step="02"
                            icon="✨"
                            title="Customize Your Trip"
                            description="Set your travel style, budget, group size, and duration. Our AI builds a personalized day-by-day itinerary just for you."
                        />
                        <StepCard
                            step="03"
                            icon="✈️"
                            title="Book & Explore"
                            description="Confirm with a simple payment and receive your complete travel plan instantly. Then just pack your bags and go!"
                        />
                    </div>
                </div>
            </section>

            {/* ── Handpicked Trips ── */}
            <section id="trips" className="py-24 wrapper flex flex-col gap-12">
                <div className="section-heading">
                    <span className="section-label">Handpicked for you</span>
                    <h2>Explore Our Best Trips</h2>
                    <p>
                        Browse well-planned trips designed for every travel style and budget
                    </p>
                </div>

                <div className="trip-grid">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ""}
                            tags={[trip.interests, trip.travelStyle]}
                            price={trip.estimatedPrice}
                        />
                    ))}
                </div>

                <PagerComponent
                    totalRecordsCount={loaderData.total}
                    pageSize={8}
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass="!mb-4"
                />
            </section>

            {/* ── Testimonials ── */}
            <section className="testimonials-section">
                <div className="wrapper flex flex-col">
                    <div className="section-heading">
                        <span className="section-label">Testimonials</span>
                        <h2>What Our Travelers Say</h2>
                        <p>
                            Real experiences from real people who explored the world with Bay
                            Travel
                        </p>
                    </div>
                    <div className="testimonials-grid">
                        <TestimonialCard
                            quote="Bay Travel made planning our honeymoon incredibly easy. The AI itinerary was spot-on and we didn't have to worry about a thing!"
                            name="Sarah & James"
                            location="Bali, Indonesia"
                            avatar="/assets/images/david.webp"
                        />
                        <TestimonialCard
                            quote="I've used many travel apps, but Bay Travel is on another level. The personalized suggestions saved me hours of research."
                            name="Michael Chen"
                            location="Tokyo, Japan"
                            avatar="/assets/images/michael.webp"
                        />
                        <TestimonialCard
                            quote="From the Amalfi Coast to Rome, every detail was perfectly arranged. Our family trip was truly unforgettable!"
                            name="Emma Rodriguez"
                            location="Rome, Italy"
                            avatar="/assets/images/james.webp"
                        />
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-banner">
                <div className="wrapper">
                    <div className="cta-content">
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <h2>Ready to Start Your Journey?</h2>
                            <p>
                                Join thousands of travelers who have discovered the world with Bay
                                Travel. Your next adventure awaits.
                            </p>
                        </div>
                        <Link to="#trips">
                            <button className="h-14 px-10 rounded-xl bg-white text-primary-100 font-bold text-lg hover:bg-light-100 transition-colors duration-200 shadow-200 cursor-pointer">
                                Start Planning Today →
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="modern-footer">
                <div className="wrapper">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <Link to="/" className="flex items-center gap-2">
                                <img
                                    src="/assets/icons/logo.svg"
                                    alt="logo"
                                    className="size-8 brightness-200"
                                />
                                <span className="text-xl font-bold text-white">Bay Travel</span>
                            </Link>
                            <p>
                                AI-powered travel planning for modern explorers. Discover the
                                world, your way.
                            </p>
                        </div>

                        <div className="footer-col">
                            <h3>Explore</h3>
                            <div className="footer-links">
                                {["Destinations", "Trips", "AI Planner", "Group Travel"].map(
                                    (item) => (
                                        <Link key={item} to="/">
                                            {item}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="footer-col">
                            <h3>Company</h3>
                            <div className="footer-links">
                                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                                    <Link key={item} to="/">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="footer-col">
                            <h3>Support</h3>
                            <div className="footer-links">
                                {[
                                    "Help Center",
                                    "Contact Us",
                                    "Privacy Policy",
                                    "Terms of Service",
                                ].map((item) => (
                                    <Link key={item} to="/">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 Bay Travel. All rights reserved.</p>
                        <div className="social-links">
                            {["Twitter", "Instagram", "Facebook", "LinkedIn"].map((s) => (
                                <Link key={s} to="/">
                                    {s}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default TravelPage;
