/**
 * Icon shim — wraps @hugeicons/react + @hugeicons/core-free-icons so the rest
 * of the codebase can use simple named exports identical to the old
 * hugeicons-react API: <AlertCircleIcon size={24} className="..." />
 */
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsProps } from "@hugeicons/react";
import {
  AlertCircleIcon as _AlertCircle,
  AnalyticsUpIcon as _AnalyticsUp,
  ArrowDown01Icon as _ArrowDown01,
  ArrowUp01Icon as _ArrowUp01,
  Calendar01Icon as _Calendar01,
  CalendarCheckIcon as _CalendarCheck,
  Cancel01Icon as _Cancel01,
  ChartBarIncreasingIcon as _ChartBar,
  ChartDecreaseIcon as _ChartDecrease,
  CheckmarkCircle02Icon as _CheckmarkCircle02,
  Clock01Icon as _Clock01,
  CreditCardIcon as _CreditCard,
  DatabaseIcon as _Database,
  DocumentCodeIcon as _DocumentCode,
  Globe01Icon as _Globe01,
  GoogleIcon as _Google,
  HeadsetIcon as _Headset,
  Link01Icon as _Link01,
  LinkSquare01Icon as _LinkSquare01,
  Mail01Icon as _Mail01,
  MapsLocationIcon as _MapsLocation,
  Megaphone01Icon as _Megaphone01,
  Menu01Icon as _Menu01,
  Message01Icon as _Message01,
  MoneyRemoveIcon as _MoneyRemove,
  Notification02Icon as _Notification02,
  RefreshIcon as _Refresh,
  Rocket01Icon as _Rocket01,
  Settings01Icon as _Settings01,
  TickDoubleIcon as _TickDouble,
  UserCheck01Icon as _UserCheck01,
  UserRemoveIcon as _UserRemove,
  WhatsappIcon as _Whatsapp,
} from "@hugeicons/core-free-icons";

type IconProps = Omit<HugeiconsProps, "icon">;
const wrap = (icon: unknown) =>
  function Icon(props: IconProps) {
    return (
      <HugeiconsIcon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon={icon as any}
        strokeWidth={1.5}
        {...props}
      />
    );
  };

export const AlertCircleIcon    = wrap(_AlertCircle);
export const AnalyticsUpIcon    = wrap(_AnalyticsUp);
export const ArrowDown01Icon    = wrap(_ArrowDown01);
export const ArrowUp01Icon      = wrap(_ArrowUp01);
export const Calendar01Icon     = wrap(_Calendar01);
/** CalendarCheck01Icon → CalendarCheckIcon in core-free-icons */
export const CalendarCheck01Icon = wrap(_CalendarCheck);
export const Cancel01Icon       = wrap(_Cancel01);
/** ChartBarIcon → ChartBarIncreasingIcon in core-free-icons */
export const ChartBarIcon       = wrap(_ChartBar);
export const ChartDecreaseIcon  = wrap(_ChartDecrease);
export const CheckmarkCircle02Icon = wrap(_CheckmarkCircle02);
export const Clock01Icon        = wrap(_Clock01);
export const CreditCardIcon     = wrap(_CreditCard);
export const DatabaseIcon       = wrap(_Database);
export const DocumentCodeIcon   = wrap(_DocumentCode);
export const Globe01Icon        = wrap(_Globe01);
export const GoogleIcon         = wrap(_Google);
export const HeadsetIcon        = wrap(_Headset);
export const Link01Icon         = wrap(_Link01);
export const LinkSquare01Icon   = wrap(_LinkSquare01);
export const Mail01Icon         = wrap(_Mail01);
export const MapsLocationIcon   = wrap(_MapsLocation);
export const Megaphone01Icon    = wrap(_Megaphone01);
export const Menu01Icon         = wrap(_Menu01);
export const Message01Icon      = wrap(_Message01);
export const MoneyRemoveIcon    = wrap(_MoneyRemove);
export const Notification02Icon = wrap(_Notification02);
export const RefreshIcon        = wrap(_Refresh);
export const Rocket01Icon       = wrap(_Rocket01);
export const Settings01Icon     = wrap(_Settings01);
export const TickDoubleIcon     = wrap(_TickDouble);
export const UserCheck01Icon    = wrap(_UserCheck01);
export const UserRemoveIcon     = wrap(_UserRemove);
export const WhatsappIcon       = wrap(_Whatsapp);
