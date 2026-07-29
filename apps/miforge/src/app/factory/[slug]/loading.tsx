import { MonoLabel } from "@/components/shared/MonoLabel";

export default function FactoryLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-milyfe-bg">
      <div className="text-center space-y-4">
        <div className="font-fraunces text-3xl text-milyfe-gradient animate-pulse">MiLyfe</div>
        <MonoLabel>LOADING FACTORY...</MonoLabel>
      </div>
    </main>
  );
}
