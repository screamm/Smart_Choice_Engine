import { Handlers, PageProps } from "$fresh/server.ts";
import type { Customer, Recommendation } from "../types.ts";
import { mockCustomers, getRecommendationsForCustomer } from "../data/mockData.ts";

interface Data {
  selectedCustomer?: Customer;
  recommendations?: Recommendation[];
  customers: Customer[];
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");

    let selectedCustomer;
    let recommendations;

    if (customerId) {
      const id = parseInt(customerId);
      selectedCustomer = mockCustomers.find(c => c.id === id);
      if (selectedCustomer) {
        recommendations = getRecommendationsForCustomer(id);
      }
    }

    return ctx.render({
      customers: mockCustomers,
      selectedCustomer,
      recommendations,
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { customers, selectedCustomer, recommendations } = data;

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <div class="container mx-auto px-6 py-8">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-emerald-400 mb-2">Smart Choice</h1>
          <p class="text-zinc-400">AI-Powered Recommendation Engine</p>
        </header>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-zinc-900 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Select Customer</h2>
            
            <form method="GET" class="mb-6">
              <select
                name="customerId"
                onchange="this.form.submit()"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded"
              >
                <option value="">Choose a customer...</option>
                {customers.map(customer => (
                  <option
                    value={customer.id}
                    selected={selectedCustomer?.id === customer.id}
                  >
                    {customer.name} ({customer.segment})
                  </option>
                ))}
              </select>
            </form>

            {selectedCustomer && (
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-emerald-400">{selectedCustomer.name}</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-zinc-400">Purchases:</span>
                    <span class="ml-2">{selectedCustomer.totalPurchases}</span>
                  </div>
                  <div>
                    <span class="text-zinc-400">Avg Order:</span>
                    <span class="ml-2">{selectedCustomer.avgOrderValue}</span>
                  </div>
                  <div>
                    <span class="text-zinc-400">Score:</span>
                    <span class="ml-2 text-emerald-400">{Math.round(selectedCustomer.behaviorScore * 100)}%</span>
                  </div>
                  <div>
                    <span class="text-zinc-400">Location:</span>
                    <span class="ml-2">{selectedCustomer.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div class="bg-zinc-900 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Recommendations</h2>
            
            {selectedCustomer && recommendations ? (
              <div class="space-y-4">
                {recommendations.map((rec, index) => (
                  <div class="bg-zinc-800 p-4 rounded border border-zinc-700">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="font-medium">{rec.name}</h3>
                        <p class="text-emerald-400 font-semibold">{rec.price} SEK</p>
                        <p class="text-sm text-zinc-400 mt-1">{rec.reason}</p>
                      </div>
                      <div class="text-2xl">{rec.image}</div>
                    </div>
                    <div class="mt-2">
                      <span class="text-xs bg-emerald-400 text-zinc-900 px-2 py-1 rounded">
                        {Math.round(rec.recommendationScore * 100)}% match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="text-center py-8 text-zinc-500">
                Select a customer to see personalized recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
