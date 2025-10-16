// POST - Add metric to dashboard
// DELETE - Remove metric from dashboard
export async function POST(request: Request) {
  const { metricId } = await request.json();
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Response.json({ success: true, metricId });
}

export async function DELETE(request: Request) {
  const { metricId } = await request.json();
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Response.json({ success: true, metricId });
}
