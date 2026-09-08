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
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Profile
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />

          <div className="px-5 pb-6 sm:px-8">
            {/* Avatar + edit */}
            <div className="-mt-14 flex items-end justify-between">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md dark:border-zinc-900">
                  <AvatarImage src="" alt="Profile picture" />

                  <AvatarFallback className="bg-zinc-900 text-2xl font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    WE
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  aria-label="Change profile picture"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-white shadow-sm transition hover:bg-zinc-700 dark:border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit profile
              </Button>
            </div>

            {/* User */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Wassel Essalah
                </h2>

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                @wassel
              </p>
            </div>

            {/* Information */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="wassel@example.com"
              />

              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Username"
                value="@wassel"
              />

              <InfoItem
                icon={<MessageSquare className="h-4 w-4" />}
                label="Status"
                value="Available"
                valueClassName="text-emerald-600 dark:text-emerald-400"
              />

              <InfoItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Account"
                value="Verified"
                valueClassName="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Account
          </h2>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ProfileAction
              icon={<User className="h-5 w-5" />}
              title="Personal information"
              description="Update your name, username and profile"
            />

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <ProfileAction
              icon={<Lock className="h-5 w-5" />}
              title="Password & security"
              description="Manage your password and security options"
            />

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <ProfileAction
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Privacy"
              description="Control your privacy and visibility settings"
            />

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <ProfileAction
              icon={<MoreHorizontal className="h-5 w-5" />}
              title="More settings"
              description="Manage additional account preferences"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Information item */
/* -------------------------------- */

function InfoItem({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100 ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Account action */
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
      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

export default Profile;