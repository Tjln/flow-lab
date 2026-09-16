import Image from "next/image";

/**
 * Le logotype est fourni en SVG vectorise dans deux declinaisons de la charte.
 * On choisit la variante selon le fond sur lequel il est pose.
 */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Image
      src={tone === "dark" ? "/brand/logo-dark.svg" : "/brand/logo-light.svg"}
      alt="flow_lab"
      width={385}
      height={95}
      priority
      className={className}
    />
  );
}
