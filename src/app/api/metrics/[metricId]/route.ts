import { generateMockData } from "@/lib/mockData";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  processing: boolean;
  retries: number;
};

const metricCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 60 * 1000;
const MAX_RETRIES = 3;

const MetricParamsSchema = z.object({
  metricId: z.string().uuid().or(z.string().regex(/^custom_\w+$/)),
});

const normalizeMetricId = (id: string): string => {
  return id.toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

const fetchMetricData = async <T>(
  metricId: string,
  options: {
    forceRefresh?: boolean;
    timeout?: number;
    signal?: AbortSignal;
  } = {}
): Promise<T> => {
  const normalizedId = normalizeMetricId(metricId);
  const now = Date.now();
  const cached = metricCache.get(normalizedId);
  
  if (
    cached && 
    !options.forceRefresh && 
    now - cached.timestamp < CACHE_TTL &&
    !cached.processing
  ) {
    console.log(`Cache hit for metric: ${normalizedId}`);
    return cached.data;
  }
  
  if (cached?.processing) {
    console.log(`Waiting for in-progress fetch: ${normalizedId}`);
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const latestCache = metricCache.get(normalizedId);
        if (latestCache && !latestCache.processing) {
          clearInterval(checkInterval);
          resolve(latestCache.data);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Fetch timeout while waiting for processing"));
      }, options.timeout || 5000);
    });
  }

  metricCache.set(normalizedId, {
    data: cached?.data || null,
    timestamp: cached?.timestamp || 0,
    processing: true,
    retries: 0,
  });
  
  try {
    const data = generateMockData(normalizedId) as T;
    
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    metricCache.set(normalizedId, {
      data,
      timestamp: Date.now(), 
      processing: false,
      retries: 0,
    });
    
    return data;
  } catch (error) {
    const currentEntry = metricCache.get(normalizedId);
    const retries = (currentEntry?.retries || 0) + 1;
    
    if (retries <= MAX_RETRIES) {
      console.log(`Retry ${retries}/${MAX_RETRIES} for metric: ${normalizedId}`);
      metricCache.set(normalizedId, {
        ...currentEntry!,
        retries,
        processing: false,
      });
      
      return fetchMetricData<T>(metricId, options);
    }
    
    metricCache.set(normalizedId, {
      data: null,
      timestamp: Date.now(),
      processing: false,
      retries: 0,
    });
    
    throw error;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ metricId: string }> }
) {
  try {
    const { metricId } = await params;
    const result = MetricParamsSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid metric ID format", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get("refresh") === "true";
    const timeoutStr = searchParams.get("timeout");
    const timeout = timeoutStr ? parseInt(timeoutStr, 10) : undefined;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || 10000);
    
    const data = await fetchMetricData(metricId, {
      forceRefresh,
      timeout,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const processedData = data ? {
      ...data,
      timestamp: new Date().toISOString(),
      source: "metrics-api",
    } : null;
    
    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error(`Error processing metric`, error);
    
    const status = error.name === 'AbortError' ? 504 : 
                   error.message?.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status }
    );
  }
}
