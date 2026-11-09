import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center py-1.5 select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-vertical:px-1.5 data-vertical:py-0">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-[oklch(0.21_0.015_260/0.13)] select-none dark:bg-[oklch(1_0_0/0.16)] data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block h-5 w-7 shrink-0 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-[scale,box-shadow] duration-300 ease-(--ease-spring) select-none after:absolute after:-inset-2 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-hidden active:scale-110 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none data-vertical:h-7 data-vertical:w-5"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
