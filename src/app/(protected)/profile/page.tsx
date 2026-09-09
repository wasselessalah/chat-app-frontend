"use client";

import {
  Camera,
  Check,
  ChevronRight,
  Edit3,
  Lock,
  Mail,
  MessageSquare,
  MoreHorizontal,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Profile() {
  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                Profile
              </h1>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Manage your profile and account settings.
              </p>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Minimal cover */}
          <div className="h-20 bg-zinc-100 dark:bg-zinc-800/80" />

          <div className="px-5 pb-6 sm:px-7">
            {/* Avatar + Actions */}
            <div className="-mt-10 flex items-end justify-between gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-sm dark:border-zinc-900">
                  <AvatarImage src="" alt="Profile picture" />

                  <AvatarFallback className="bg-zinc-900 text-xl font-semibold text-white dark:bg-white dark:text-zinc-900">
                    WE
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  aria-label="Change profile picture"
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-white shadow-sm transition hover:scale-105 hover:bg-zinc-700 dark:border-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg px-3"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit profile
              </Button>
            </div>

            {/* User information */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  Wassel Essalah
                </h2>

                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white"
                  title="Verified account"
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              </div>

              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                @wassel
              </p>
            </div>

            {/* Information */}
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <InfoItem
                icon={<Mail />}
                label="Email"
                value="wassel@example.com"
              />

              <InfoItem
                icon={<User />}
                label="Username"
                value="@wassel"
              />

              <InfoItem
                icon={<MessageSquare />}
                label="Status"
                value="Available"
                status="online"
              />

              <InfoItem
                icon={<ShieldCheck />}
                label="Account"
                value="Verified"
                status="verified"
              />
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mt-8">
          <div className="mb-3 px-1">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Account settings
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Manage your account preferences and security.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ProfileAction
              icon={<User />}
              title="Personal information"
              description="Update your name, username and profile details"
            />

            <Divider />

            <ProfileAction
              icon={<Lock />}
              title="Password & security"
              description="Manage your password, sessions and security"
            />

            <Divider />

            <ProfileAction
              icon={<ShieldCheck />}
              title="Privacy"
              description="Control your privacy and visibility settings"
            />

            <Divider />

            <ProfileAction
              icon={<MoreHorizontal />}
              title="More settings"
              description="Manage additional account preferences"
            />
          </div>
        </section>

        {/* Account status */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Your account is secure
        </div>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Information Item */
/* -------------------------------- */

function InfoItem({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: "online" | "verified";
}) {
  return (
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-950/60">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {label}
        </p>

        <div className="mt-0.5 flex min-w-0 items-center gap-2">
          {status === "online" && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          )}

          {status === "verified" && (
            <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          )}

          <p
            className={`truncate text-sm font-medium ${
              status === "online"
                ? "text-emerald-600 dark:text-emerald-400"
                : status === "verified"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Account Action */
/* -------------------------------- */

function ProfileAction({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 dark:hover:bg-zinc-800/50 dark:focus-visible:ring-zinc-600 sm:px-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all group-hover:border-zinc-300 group-hover:bg-white group-hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/70 dark:text-zinc-300 dark:group-hover:border-zinc-700 dark:group-hover:bg-zinc-800">
        <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500" />
    </button>
  );
}

/* -------------------------------- */
/* Divider */
/* -------------------------------- */

function Divider() {
  return <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800" />;
}

export default Profile;