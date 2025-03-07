export function generateLetterHTML(application) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Letter</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 10px;
                background-color: #f8f9fa;
            }

            .letter-container {
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: auto;
            }

            .header, .recipient, .subject, .body {
                margin-bottom: 20px;
            }

            .subject {
                font-weight: bold;
            }

            .body {
                line-height: 1.6;
            }

            /* Signature Section */
            .signature-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 50px;
                border-top: 1px solid #ccc;
                padding-top: 20px;
                flex-wrap: wrap;
                gap: 20px;
            }

            .signature {
                text-align: center;
                flex: 1;
                min-width: 120px;
            }

            .signature img {
                width: 150px;
                max-width: 100%;
                height: auto;
            }

            /* Responsive Design */
            @media (max-width: 600px) {
                .letter-container {
                    padding: 20px;
                }
                
                .signature-container {
                    flex-direction: column;
                    align-items: center;
                }

                .signature {
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="letter-container">
            <!-- Sender Details -->
            <div class="header">
                <p>${application.from.name}</p>
                <p>${application.from.email}</p>
                <p>Date: ${new Date(application.createdAt).toLocaleDateString()}</p>
            </div>

            <!-- Recipient Details -->
            <div class="recipient">
                <p>To,</p>
                ${application.to.map(recipient => `
                    <p><strong>${recipient.faculty?.name}</strong></p>
                    <p>${recipient.position}${recipient.faculty?.department ? `, ${recipient.faculty.department}` : ''}</p>
                    <p>${recipient.faculty?.email}</p>
                `).join('')}
            </div>

            <!-- Subject -->
            <div class="subject">
                <strong>Subject:</strong> ${application.title}
            </div>

            <!-- Body -->
            <div class="body">
                <p>Dear ${application.to.map(recipient => recipient.faculty?.name).join(", ")},</p>
                <p>${application.body}</p>
                <p>Sincerely,</p>
                <p><strong>${application.from.name}</strong></p>
                <p><strong>${application.from.registrationNo}</strong></p>
            </div>

            <!-- Signature Section -->
            <div class="signature-container">
                ${application.to.map(recipient => `
                    <div class="signature">
                        <img src="${recipient.signature}" alt="Signature">
                        <p>${recipient.faculty?.name}<br/>${recipient.position}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
    `;
}
