import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, count, deviceInfo } = body;

    // YOUR DISCORD WEBHOOK URL
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1469955377259872267/CnEGFzCoI5xwRT2DJYbzOeRt9-0Bi6sBXvYPGq6I4zj7hpZEQEoZxMhw8irBSRjulLox";

    if (!WEBHOOK_URL) {
      return NextResponse.json({ error: 'Webhook URL missing' }, { status: 500 });
    }

    // 1. Get IP Address
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';
    
    // 2. Determine Color & Title based on Action
    let embedColor = 16776960; // Yellow (Warning/Info)
    let title = "⚠️ Interaction Update";

    if (action.includes("Stage 1")) {
      embedColor = 3447003; // Blue (Valentine Yes)
      title = "💙 She accepted Valentine!";
    } else if (action.includes("Stage 2") || action.includes("Final")) {
      embedColor = 15548997; // Pink/Red (Marriage Yes)
      title = "💍💘 SHE SAID YES TO MARRIAGE! 💘💍";
    }

    // 3. Construct the Rich Message
    const message = {
      content: action.includes("Final") ? "@everyone **SHE SAID YES!** 🎉" : "👀 **New Update**",
      embeds: [
        {
          title: title,
          description: `**Current Status:**\nUser has clicked YES on **${action}**`,
          color: embedColor,
          fields: [
            {
              name: "💔 Refusal Count",
              value: `${count} times`,
              inline: true
            },
            {
              name: "📍 IP Address",
              value: `${ip}`,
              inline: true
            },
            {
              name: "📱 Device OS/Browser",
              value: deviceInfo?.userAgent || "Unknown",
              inline: false
            },
            {
              name: "🖥️ Screen Size",
              value: deviceInfo?.screenSize || "Unknown",
              inline: true
            },
            {
              name: "🌍 Language",
              value: deviceInfo?.language || "Unknown",
              inline: true
            },
            {
              name: "🔋 Battery",
              value: deviceInfo?.battery || "Unknown",
              inline: true
            },
            {
              name: "ww Timezone",
              value: deviceInfo?.timezone || "Unknown",
              inline: true
            }
          ],
          footer: {
            text: "Valentine Tracker Bot 🤖",
            icon_url: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
          },
          timestamp: new Date().toISOString(),
        }
      ]
    };

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}