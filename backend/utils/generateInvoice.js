import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  // TITLE
  doc
    .fontSize(20)
    .text("INVOICE", { align: "center" })
    .moveDown();

  // ORDER INFO
  doc.fontSize(12);
  doc.text(`Order ID: ${order._id}`);
  doc.text(
    `Order Date: ${new Date(
      order.createdAt
    ).toLocaleString()}`
  );
  doc.text(
    `Payment Status: ${
      order.isPaid ? "Paid" : "Unpaid"
    }`
  );

  if (order.isPaid && order.paidAt) {
    doc.text(
      `Paid At: ${new Date(
        order.paidAt
      ).toLocaleString()}`
    );
  }

  doc.moveDown();

  // USER INFO
  doc.text(
    `Customer: ${order.user.name}`
  );
  doc.text(
    `Email: ${order.user.email}`
  );

  doc.moveDown();

  // ITEMS HEADER
  doc.fontSize(14).text("Items");
  doc.moveDown(0.5);

  doc.fontSize(12);

  order.orderItems.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} — ₹${item.price} × ${
        item.qty
      } = ₹${item.price * item.qty}`
    );
  });

  doc.moveDown();

  // TOTAL
  doc
    .fontSize(14)
    .text(
      `Total Amount: ₹ ${order.totalPrice}`,
      { align: "right" }
    );

  doc.end();
};
