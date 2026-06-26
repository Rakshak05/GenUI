import { z } from "zod";

export const FlightCardProps = z.object({
  title: z.string().describe("Flight card title"),
  airline: z.string().describe("Airline name"),
  origin: z.string().describe("Departure airport/city"),
  destination: z.string().describe("Arrival airport/city"),
  departure_time: z.string().describe("Departure time"),
  price: z.string().describe("Price display"),
});

type FlightCardPropsType = z.infer<typeof FlightCardProps>;

export function FlightCard({
  title,
  airline,
  origin,
  destination,
  departure_time,
  price,
}: FlightCardPropsType) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-5 space-y-4 shadow-md max-w-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <span className="font-bold text-gray-800 tracking-tight">{title}</span>
        <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold">
          {airline}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-xl font-bold text-gray-900">{origin}</div>
            <div className="text-xs text-gray-400">Origin</div>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <div className="w-full border-t border-dashed border-gray-300 relative my-2">
              <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white px-2 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                Direct
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{destination}</div>
            <div className="text-xs text-gray-400">Destination</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-2">
          <div className="text-gray-500 font-medium">
            Departs: <span className="text-gray-800 font-semibold">{departure_time}</span>
          </div>
          <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {price}
          </div>
        </div>
      </div>
    </div>
  );
}
