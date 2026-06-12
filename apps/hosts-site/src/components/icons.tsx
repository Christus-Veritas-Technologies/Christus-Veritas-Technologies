import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsProps } from "@hugeicons/react";
import {
  AiBrain01Icon as _AiBrain01,
  AlertCircleIcon as _AlertCircle,
  AnalyticsUpIcon as _AnalyticsUp,
  ArrowDown01Icon as _ArrowDown01,
  ArrowUp01Icon as _ArrowUp01,
  BrowserIcon as _Browser,
  Calendar01Icon as _Calendar01,
  CalendarCheckIcon as _CalendarCheck,
  Cancel01Icon as _Cancel01,
  ChartBarIncreasingIcon as _ChartBar,
  ChartDecreaseIcon as _ChartDecrease,
  ChartIncreaseIcon as _ChartIncrease,
  CheckmarkCircle02Icon as _CheckmarkCircle02,
  Clock01Icon as _Clock01,
  CreditCardIcon as _CreditCard,
  DatabaseIcon as _Database,
  DocumentCodeIcon as _DocumentCode,
  FileDownloadIcon as _FileDownload,
  GlobeIcon as _Globe,
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
  MoneySend01Icon as _MoneySend,
  Notification02Icon as _Notification02,
  RefreshIcon as _Refresh,
  Rocket01Icon as _Rocket01,
  Search01Icon as _Search01,
  Settings01Icon as _Settings01,
  SmartPhone01Icon as _SmartPhone01,
  TickDoubleIcon as _TickDouble,
  UserCheck01Icon as _UserCheck01,
  UserListIcon as _UserList,
  UserMultipleIcon as _UserMultiple,
  UserRemoveIcon as _UserRemove,
  WhatsappIcon as _Whatsapp,
  Sun01Icon as _Sun01,
  Moon01Icon as _Moon01,
} from "@hugeicons/core-free-icons";

type IconProps = Omit<HugeiconsProps, "icon">;
const wrap = (icon: unknown) =>
  function Icon(props: IconProps) {
    return <HugeiconsIcon icon={icon as any} strokeWidth={1.5} {...props} />;
  };

export const AiBrain01Icon = wrap(_AiBrain01);
export const AlertCircleIcon = wrap(_AlertCircle);
export const AnalyticsUpIcon = wrap(_AnalyticsUp);
export const ArrowDown01Icon = wrap(_ArrowDown01);
export const ArrowUp01Icon = wrap(_ArrowUp01);
export const BrowserIcon = wrap(_Browser);
export const Calendar01Icon = wrap(_Calendar01);
/** CalendarCheckIcon aliased as CalendarCheck01Icon for page usage */
export const CalendarCheckIcon = wrap(_CalendarCheck);
export const CalendarCheck01Icon = wrap(_CalendarCheck);
export const Cancel01Icon = wrap(_Cancel01);
/** ChartBarIncreasingIcon aliased as ChartBarIcon for page usage */
export const ChartBarIcon = wrap(_ChartBar);
export const ChartBarIncreasingIcon = wrap(_ChartBar);
export const ChartDecreaseIcon = wrap(_ChartDecrease);
export const ChartIncreaseIcon = wrap(_ChartIncrease);
export const CheckmarkCircle02Icon = wrap(_CheckmarkCircle02);
export const Clock01Icon = wrap(_Clock01);
export const CreditCardIcon = wrap(_CreditCard);
export const DatabaseIcon = wrap(_Database);
export const DocumentCodeIcon = wrap(_DocumentCode);
export const FileDownloadIcon = wrap(_FileDownload);
/** GlobeIcon aliased as Globe01Icon for page usage */
export const GlobeIcon = wrap(_Globe);
export const Globe01Icon = wrap(_Globe);
export const GoogleIcon = wrap(_Google);
export const HeadsetIcon = wrap(_Headset);
export const Link01Icon = wrap(_Link01);
export const LinkSquare01Icon = wrap(_LinkSquare01);
export const Mail01Icon = wrap(_Mail01);
export const MapsLocationIcon = wrap(_MapsLocation);
export const Megaphone01Icon = wrap(_Megaphone01);
export const Menu01Icon = wrap(_Menu01);
export const Message01Icon = wrap(_Message01);
export const MoneyRemoveIcon = wrap(_MoneyRemove);
/** MoneySendIcon backed by MoneySend01Icon */
export const MoneySendIcon = wrap(_MoneySend);
export const MoneySend01Icon = wrap(_MoneySend);
export const Notification02Icon = wrap(_Notification02);
export const RefreshIcon = wrap(_Refresh);
export const Rocket01Icon = wrap(_Rocket01);
export const Search01Icon = wrap(_Search01);
export const Settings01Icon = wrap(_Settings01);
export const SmartPhone01Icon = wrap(_SmartPhone01);
export const TickDoubleIcon = wrap(_TickDouble);
export const UserCheck01Icon = wrap(_UserCheck01);
export const UserListIcon = wrap(_UserList);
export const UserMultipleIcon = wrap(_UserMultiple);
export const UserRemoveIcon = wrap(_UserRemove);
export const WhatsappIcon = wrap(_Whatsapp);
export const Sun01Icon = wrap(_Sun01);
export const Moon01Icon = wrap(_Moon01);
