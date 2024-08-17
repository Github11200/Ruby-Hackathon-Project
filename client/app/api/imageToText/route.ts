export async function POST(request: Request) {
  const base64String = (await request.json()).base64String;
  const formData = new FormData();
  formData.append("base64Image", base64String as string);
  formData.append("language", "eng");
  formData.append("apikey", process.env.OCR_API_KEY as string);
  formData.append("OCREngine", "2");

  const data = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  }).then((res) => {
    return res.json();
  });

  return new Response(JSON.stringify({ data: data }));
}
