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

  /* ================= TITLE ================= */
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", { align: "center" })
    .moveDown();

  /* ================= ORDER INFO ================= */
  doc.fontSize(12).font("Helvetica");

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

  /* ================= CUSTOMER INFO ================= */
  doc
    .font("Helvetica-Bold")
    .text("Customer Details");
  doc.moveDown(0.3);

  doc.font("Helvetica");
  doc.text(`Name: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);

  doc.moveDown();

  /* ================= SHIPPING ADDRESS ================= */
  if (order.shippingAddress) {
    const addr = order.shippingAddress;

    doc
      .font("Helvetica-Bold")
      .text("Shipping Address");
    doc.moveDown(0.3);

    doc.font("Helvetica");

    if (addr.fullName) doc.text(addr.fullName);
    if (addr.phone) doc.text(`Phone: ${addr.phone}`);

    doc.text(addr.addressLine1);

    if (addr.addressLine2) {
      doc.text(addr.addressLine2);
    }

    doc.text(
      `${addr.city}, ${addr.state} ${addr.postalCode}`
    );

    doc.text(addr.country);

    doc.moveDown();
  }

  /* ================= ITEMS ================= */
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Items");
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(12);

  order.orderItems.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} — ₹${item.price} × ${
        item.qty
      } = ₹${item.price * item.qty}`
    );
  });

  doc.moveDown();

  /* ================= TOTAL ================= */
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(
      `Total Amount: ₹ ${order.totalPrice}`,
      { align: "right" }
    );

  doc.end();
};
