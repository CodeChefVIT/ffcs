'use client';
import useVtopCatalogue from '@/hooks/useVtopCatalogue';
import AlertModal from '@/components/ui/AlertModal';

type Props = ReturnType<typeof useVtopCatalogue> & { onReady: () => void };
export default function VtopExtensionModal({
  modal,
  status,
  error,
  busy,
  select,
  closeModal,
  onReady,
}: Props) {
  const install = modal === 'install';
  const progress = modal === 'progress';
  const button =
    'inline-block rounded-xl border-2 border-black px-4 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50';
  const retry = async () => {
    if (await select()) onReady();
  };
  return (
    <AlertModal
      open={Boolean(modal)}
      title={install ? 'Get My VTOP' : progress ? 'Preparing My VTOP' : 'My VTOP'}
      color="purple"
      onClose={closeModal}
      message={
        install
          ? 'Install the FFCS-inator extension to use the courses available to your VTOP account. Your course data stays in this browser.'
          : progress
            ? `VTOP is fetching your ${status?.stage === 'categories' ? 'course categories' : 'course details'}. You can keep using the other branches while it finishes.`
            : error ||
              'The extension is connected. Log in to VTOP and your courses will be fetched automatically. Look for the “Inator ready!” banner, then return here.'
      }
    >
      {install && (
        <ol className="text-left text-sm space-y-2 list-decimal pl-5 mt-4">
          <li>Download the extension ZIP and extract it.</li>
          <li>Open Chrome or Edge Extensions and enable Developer mode.</li>
          <li>Choose Load unpacked and select the extracted folder.</li>
          <li>Refresh this app and VTOP, then log in to VTOP in the same browser profile.</li>
        </ol>
      )}
      {progress && (
        <div className="mt-4 text-sm">
          <progress
            className="w-full accent-[#7954BA]"
            max={status?.total || 1}
            value={status?.total ? status.completed : undefined}
            aria-label="VTOP capture progress"
          />
          <p>
            {status?.completed || 0} / {status?.total || '…'}{' '}
            {status?.stage === 'categories' ? 'categories' : 'courses'}
          </p>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {install && (
          <a href="/extensions/ffcs-vtop.zip" download className={`${button} bg-[#FFEA79]`}>
            Download extension
          </a>
        )}
        {!install && (
          <a
            href="https://vtop.vit.ac.in/vtop/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${button} bg-[#FFEA79]`}
          >
            Go to VTOP
          </a>
        )}
        <button disabled={busy} className={`${button} bg-[#C1FF83]`} onClick={() => void retry()}>
          {busy ? 'Checking…' : 'Check again'}
        </button>
      </div>
    </AlertModal>
  );
}
