-- Function to restore stock when an order is cancelled
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run if status changed to 'Cancelled'
  IF (OLD.status != 'Cancelled' AND NEW.status = 'Cancelled') THEN
    -- Increment stock for each item in the order
    UPDATE public.products p
    SET stock = p.stock + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id 
    AND p.id = oi.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run when order status is updated
DROP TRIGGER IF EXISTS on_order_cancelled_restore_stock ON public.orders;
CREATE TRIGGER on_order_cancelled_restore_stock
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE PROCEDURE public.restore_stock_on_cancellation();
