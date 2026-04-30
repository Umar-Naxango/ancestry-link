import { NextResponse } from 'next/server';

type InvitePayload = {
  to: string;
  role: 'viewer' | 'editor';
  message?: string;
  inviteLink: string;
  inviterName: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InvitePayload;
    const { to, role, message, inviteLink, inviterName } = body;

    if (!to || !role || !inviteLink) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.INVITE_FROM_EMAIL;

    if (!apiKey || !from) {
      return NextResponse.json(
        { error: 'Missing RESEND_API_KEY or INVITE_FROM_EMAIL on server.' },
        { status: 500 }
      );
    }

    const permissionText = role === 'editor' ? 'edit access' : 'view-only access';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
        <h2>You are invited to AncestryLink</h2>
        <p><strong>${inviterName}</strong> invited you with <strong>${permissionText}</strong>.</p>
        ${message ? `<p>Message: ${message}</p>` : ''}
        <p>
          <a href="${inviteLink}" style="display:inline-block;padding:10px 16px;background:#059669;color:#fff;text-decoration:none;border-radius:8px;">
            Open Invitation
          </a>
        </p>
        <p>If the button does not work, open this link:</p>
        <p>${inviteLink}</p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${inviterName} invited you to AncestryLink`,
        html,
      }),
    });

    const resendBody = await resendRes.json();
    if (!resendRes.ok) {
      return NextResponse.json(
        { error: resendBody?.message || 'Failed to send email.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: resendBody?.id || null });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown server error.' },
      { status: 500 }
    );
  }
}

