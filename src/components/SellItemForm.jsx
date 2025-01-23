export default function SellItemForm({
  item,
  quantity,
  setQuantity,
  onSell,
  onClose,
}) {
  return (
    <form
      className="pure-form pure-form-stacked"
      onSubmit={(e) => {
        e.preventDefault();
        onSell();
      }}
      style={{ border: "solid 1px white", padding: "1rem" }}
    >
      <h2 style={{ margin: "0" }}>Vender Item</h2>
      <p>
        <strong>Nombre:</strong> {item.name}
      </p>
      <p>
        <strong>Descripción:</strong> {item.description}
      </p>
      <p>
        <strong>Valor:</strong> {item.value}
      </p>
      <p>
        <strong>Cantidad:</strong> {item.quantity}
      </p>
      <input
        type="number"
        value={quantity}
        min="1"
        max={item.quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        required
      />
      <div>
        <button className="pure-button" type="submit">
          Vender
        </button>
        <button className="pure-button" type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
