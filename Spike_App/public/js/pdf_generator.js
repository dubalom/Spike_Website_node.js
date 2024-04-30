//Generate pdf function down below
        function generatePDF() {
            var element = document.getElementById(
                "startFromHere"); // Select the starting point of the content to convert to PDF
            var opt = {
                margin: [1, 0.5, 1, 0.5], // top, left, bottom, right margin in inches
                filename: 'practice-plan.pdf',
                image: {
                    type: 'jpeg',
                    quality: 0.98
                }, // Use JPEG for better color handling with high quality
                html2canvas: {
                    scale: 2
                }, // Improves the resolution of the output PDF
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait'
                }
            };

            html2pdf().set(opt).from(element).save().then(function () {
                console.log("PDF generated!");
                window.location.href =
                    '/share_plan/<%= plan.plan_number %>'; // Optionally redirect after saving the PDF
            }).catch(function (error) {
                console.error("Failed to generate PDF: ", error);
            });
        }
        document.getElementById("shareButton").addEventListener("click", function () {
            generatePDF(); // Call the generatePDF function
        });

        