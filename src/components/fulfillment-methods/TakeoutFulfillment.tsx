import MapView from "@/components/fulfillment-methods/MapView";
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";

const TakeoutFulfillment = () => {
  const { addressInfo } = useOrderInfoStore();

  const mapUrl = addressInfo.lat
    ? `https://www.google.com/maps?q=${addressInfo.lat},${addressInfo.lng}`
    : "";

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='py-[24.5px]'>
        <p className='mb-4 text-base font-semibold'>Pick up this order at:</p>
        {mapUrl ? (
          <a
            href={mapUrl}
            target='__blank'
            rel='noreferrer'
            className='text-base underline'
          >
            {addressInfo.addressString}
          </a>
        ) : (
          <span className='text-base'>{addressInfo.addressString}</span>
        )}
      </div>

      {mapUrl && (
        <a href={mapUrl} target='__blank' rel='noreferrer'>
          <MapView
            position={{ lat: addressInfo.lat!, lng: addressInfo.lng! }}
          />
        </a>
      )}
    </div>
  );
};

export default TakeoutFulfillment;
