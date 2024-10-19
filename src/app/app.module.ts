import { OverlayModule } from '@angular/cdk/overlay';
import { LocationStrategy, NgOptimizedImage, PathLocationStrategy, } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpClientModule, } from '@angular/common/http';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';
import { AppTemplate } from '@app/shared/directives/app-template';
import {
  BillsFormComponent
} from '@components/accounting-module/category-module/bills/bills-form/bills-form.component';

import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SalaryTypeFormComponent
} from '@components/employee-module/salary-type/salary-type-form/salary-type-form.component';
import { SalaryTypeComponent } from '@components/employee-module/salary-type/salary-type.component';
import {
  WorkerSalaryFormComponent
} from '@components/employee-module/worker-salary/worker-salary-form/worker-salary-form.component';
import { WorkerSalaryComponent } from '@components/employee-module/worker-salary/worker-salary.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeModule } from 'angularx-qrcode';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService, PrimeNGConfig, } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FocusTrapModule } from 'primeng/focustrap';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CcdcComponent } from './components/accounting-module/arise/components/CCDC/ccdc.component';
import {
  ConvertInternalComponent
} from './components/accounting-module/arise/components/convert-internal/convert-internal.component';
import {
  ConvertOverreachComponent
} from './components/accounting-module/arise/components/convert-overreach/convert-overreach.component';
import { CostEntryComponent } from './components/accounting-module/arise/components/cost-entry/cost-entry.component';
import { EditOrderComponent } from './components/accounting-module/arise/components/edit-order/edit-order.component';
import { EndOfTermComponent } from './components/accounting-module/arise/components/end-of-term/end-of-term.component';
import {
  RemoveDescriptionComponent
} from './components/accounting-module/arise/components/remove-description/remove-description.component';
import {
  RemovePayerComponent
} from './components/accounting-module/arise/components/remove-payer/remove-payer.component';
import {
  ReportFilterComponent
} from './components/accounting-module/arise/components/report-filter/report-filter.component';
import {
  SalaryTranferComponent
} from './components/accounting-module/arise/components/salary-tranfer/salary-tranfer.component';
import { TscdComponent } from './components/accounting-module/arise/components/TSCD/tscd.component';
import { PCComponent } from './components/accounting-module/arise/prints/PC/PC.component';
import { PCKComponent } from './components/accounting-module/arise/prints/PCK/PCK.component';
import { PNComponent } from './components/accounting-module/arise/prints/PN/PN.component';
import { PNPCComponent } from './components/accounting-module/arise/prints/pnpc/pnpc.component';
import { PTComponent } from './components/accounting-module/arise/prints/PT/PT.component';
import { PXComponent } from './components/accounting-module/arise/prints/PX/PX.component';
import { PXNComponent } from './components/accounting-module/arise/prints/pxn/pxn.component';
import { BillsComponent } from './components/accounting-module/category-module/bills/bills.component';
import {
  EndOfTermEndingComponent
} from './components/accounting-module/category-module/end-of-term-ending/end-of-term-ending.component';
import {
  TypeOfDocumentFormComponent
} from './components/accounting-module/category-module/type-of-document/type-of-document-form/type-of-document-form.component';
import {
  TypeOfDocumentComponent
} from './components/accounting-module/category-module/type-of-document/type-of-document.component';
import {
  InternalBalanceAccountComponent
} from './components/accounting-module/internal-report-module/balance-account/internal-balance-account.component';
import {
  InternalBalanceAccountantComponent
} from './components/accounting-module/internal-report-module/balance-accountant/internal-balance-accountant.component';
import {
  InternalLedgerComponent
} from './components/accounting-module/internal-report-module/ledger/internal-ledger.component';
import {
  InternalPlanMissionCountryTaxComponent
} from './components/accounting-module/internal-report-module/plan-mission-country-tax/internal-plan-mission-country-tax.component';
import {
  InternalReceiptListComponent
} from './components/accounting-module/internal-report-module/receipt-list/internal-receipt-list.component';
import {
  InternalReceiptComponent
} from './components/accounting-module/internal-report-module/receipt/internal-receipt.component';
import {
  InternalRegisterReceiptDetailComponent
} from './components/accounting-module/internal-report-module/register-receipt-detail/internal-register-receipt-detail.component';
import {
  InternalRegisterReceiptComponent
} from './components/accounting-module/internal-report-module/register-receipt/internal-register-receipt.component';
import {
  InternalSavedCurrencyComponent
} from './components/accounting-module/internal-report-module/saved-currency/internal-saved-currency.component';
import {
  OverreachBalanceAccountComponent
} from './components/accounting-module/overreach-report-module/balance-account/overreach-balance-account.component';
import {
  OverreachBalanceAccountantComponent
} from './components/accounting-module/overreach-report-module/balance-accountant/overreach-balance-accountant.component';
import {
  OverreachLedgerComponent
} from './components/accounting-module/overreach-report-module/ledger/overreach-ledger.component';
import {
  OverreachPlanMissionCountryTaxComponent
} from './components/accounting-module/overreach-report-module/plan-mission-country-tax/overreach-plan-mission-country-tax.component';
import {
  OverreachReceiptListComponent
} from './components/accounting-module/overreach-report-module/receipt-list/overreach-receipt-list.component';
import {
  OverreachReceiptComponent
} from './components/accounting-module/overreach-report-module/receipt/overreach-receipt.component';
import {
  OverreachRegisterReceiptDetailComponent
} from './components/accounting-module/overreach-report-module/register-receipt-detail/overreach-register-receipt-detail.component';
import {
  OverreachRegisterReceiptComponent
} from './components/accounting-module/overreach-report-module/register-receipt/overreach-register-receipt.component';
import {
  OverreachSavedCurrencyComponent
} from './components/accounting-module/overreach-report-module/saved-currency/overreach-saved-currency.component';
import {
  ToolsFixedAssetsFormComponent
} from './components/accounting-module/tools-fixed-assets/tools-fixed-assets-form/tools-fixed-assets-form.component';
import {
  ToolsFixedAssetsComponent
} from './components/accounting-module/tools-fixed-assets/tools-fixed-assets.component';
import {
  CustomerJobFormComponent
} from './components/customer-module/customer-job/customer-job-form/customer-job-form.component';
import { CustomerJobComponent } from './components/customer-module/customer-job/customer-job.component';
import {
  CustomerStatusFormComponent
} from './components/customer-module/customer-status/customer-status-form/customer-status-form.component';
import { CustomerStatusComponent } from './components/customer-module/customer-status/customer-status.component';
import {
  CustomerTypeFormComponent
} from './components/customer-module/customer-type/components/customer-type-form/customer-type-form.component';
import { CustomerTypeComponent } from './components/customer-module/customer-type/customer-type.component';
import {
  ContactHistoryFormComponent
} from './components/customer-module/customers/components/contact-history-form/contact-history-form.component';
import {
  CustomerHistoriesComponent
} from './components/customer-module/customers/components/customer-histories/customer-histories.component';
import {
  CustomersFormComponent
} from './components/customer-module/customers/components/customers-form/customers-form.component';
import { CustomersComponent } from './components/customer-module/customers/customers.component';
import {
  DocumentTypeFormComponent
} from './components/document-module/document-type/components/document-type-form/document-type-form.component';
import { DocumentTypeComponent } from './components/document-module/document-type/document-type.component';
import {
  IncomingTextFormComponent
} from './components/document-module/incoming-text/component/incoming-text-form.component';
import { IncomingTextComponent } from './components/document-module/incoming-text/incoming-text.component';
import { TextGoFormComponent } from './components/document-module/text-go/component/text-go-form.component';
import { TextGoComponent } from './components/document-module/text-go/text-go.component';
import { AchievementsComponent } from './components/employee-module/achievements/achievements.component';
import {
  AchievementFormComponent
} from './components/employee-module/achievements/components/achievement-form/achievement-form.component';
import { BranchComponent } from './components/employee-module/branch/branch.component';
import { BranchFormComponent } from './components/employee-module/branch/components/branch-form/branch-form.component';
import { DecideFormComponent } from './components/employee-module/decide/components/decide-form/decide-form.component';
import { DecideComponent } from './components/employee-module/decide/decide.component';
import {
  DepartmentFormComponent
} from './components/employee-module/department/components/department-form/department-form.component';
import { DepartmentComponent } from './components/employee-module/department/department.component';
import {
  EmployeeTypeFormComponent
} from './components/employee-module/employee-type/employee-type-form/employee-type-form.component';
import { EmployeeTypeComponent } from './components/employee-module/employee-type/employee-type.component';
import {
  GeneralStatisticsComponent
} from './components/employee-module/general-statistics/general-statistics.component';
import {
  JobTitleDetailsFormComponent
} from './components/employee-module/job-title-details/job-title-details-form/job-title-details-form.component';
import { JobTitleDetailsComponent } from './components/employee-module/job-title-details/job-title-details.component';
import {
  SalarySocailFormComponent
} from './components/employee-module/salary-social/compomemts/salary-socail-form/salary-socail-form.component';
import { SalarySocialComponent } from './components/employee-module/salary-social/salary-social.component';
import { SalaryComponent } from './components/employee-module/salary/salary.component';
import { ShiftFormComponent } from './components/employee-module/shift/shift-form/shift-form.component';
import { ShiftComponent } from './components/employee-module/shift/shift.component';
import {
  SpecializedFormComponent
} from './components/employee-module/specialized/specialized-form/specialized-form.component';
import { SpecializedComponent } from './components/employee-module/specialized/specialized.component';
import { StoreFormComponent } from './components/employee-module/store/components/store-form/store-form.component';
import { StoreComponent } from './components/employee-module/store/store.component';
import {
  TimekeepingPositionFormComponent
} from './components/employee-module/timekeeping-position/timekeeping-position-form/timekeeping-position-form.component';
import {
  TimekeepingPositionComponent
} from './components/employee-module/timekeeping-position/timekeeping-position.component';
import { TitleFormComponent } from './components/employee-module/title/title-form/title-form.component';
import { TitleComponent } from './components/employee-module/title/title.component';
import { UserFormComponent } from './components/employee-module/user/components/user-form/user-form.component';
import { UserComponent } from './components/employee-module/user/user.component';
import { BeginDeclareComponent } from './components/main-module/begin-declare/begin-declare.component';
import {
  BeginDeclareFormComponent
} from './components/main-module/begin-declare/components/begin-declare-form/begin-declare-form.component';
import { CompanyComponent } from './components/main-module/company/company.component';
import { CompanyFormComponent } from './components/main-module/company/components/company-form/company-form.component';
import { DashboardComponent } from './components/main-module/dashboard/dashboard.component';
import { AccessComponent } from './components/others-module/access/access.component';
import { CrudComponent } from './components/others-module/crud/crud.component';
import { EmptyComponent } from './components/others-module/empty/empty.component';
import { ErrorComponent } from './components/others-module/error/error.component';
import { LandingComponent } from './components/others-module/landing/landing.component';
import { NotfoundComponent } from './components/others-module/notfound/notfound.component';
import { TimelineComponent } from './components/others-module/timeline/timeline.component';
import { RelationFormComponent } from './components/relationship-module/relation/relation-form/relation-form.component';
import { RelationComponent } from './components/relationship-module/relation/relation.component';
import {
  RelativesFormComponent
} from './components/relationship-module/relatives/components/relatives-form/relatives-form.component';
import { RelativesComponent } from './components/relationship-module/relatives/relatives.component';
import { CashierComponent } from './components/sell-module/cashier/cashier.component';
import { BillTableComponent } from './components/sell-module/components/bill-table/bill-table.component';
import { DeskTableComponent } from './components/sell-module/components/desk-table/desk-table.component';
import { GoodsTableComponent } from './components/sell-module/components/goods-table/goods-table.component';
import { GoodsFormComponent } from './components/sell-module/list-of-goods/goods-form/goods-form.component';
import { ListOfGoodsComponent } from './components/sell-module/list-of-goods/list-of-goods.component';
import {
  PaymentHistoryComponent
} from './components/sell-module/sell-report-module/payment-history/payment-history.component';
import {
  ProfitAfterTaxComponent
} from './components/sell-module/sell-report-module/profit-after-tax/profit-after-tax.component';
import {
  ProfitBeforeTaxComponent
} from './components/sell-module/sell-report-module/profit-before-tax/profit-before-tax.component';
import {
  SellDetailsBookComponent
} from './components/sell-module/sell-report-module/sell-details-book/sell-details-book.component';
import { SellerComponent } from './components/sell-module/seller/seller.component';
import {
  AccountingLinkComponent
} from './components/sell-module/setup-module/accounting-link/accounting-link.component';
import { ComboComponent } from './components/sell-module/setup-module/combo/combo.component';
import {
  DefectiveGoodsComponent
} from './components/sell-module/setup-module/defective-goods/defective-goods.component';
import {
  InventoryControlComponent
} from './components/sell-module/setup-module/inventory-control/inventory-control.component';
import {
  MenuOfGoodsFormComponent
} from './components/sell-module/setup-module/menu-of-goods/component/menu-of-goods-form/menu-of-goods-form.component';
import { MenuOfGoodsComponent } from './components/sell-module/setup-module/menu-of-goods/menu-of-goods.component';
import { QuotaComponent } from './components/sell-module/setup-module/quota/quota.component';
import {
  RoomTableFormComponent
} from './components/sell-module/setup-module/room-table/component/room-table-form/room-table-form.component';
import { RoomTableComponent } from './components/sell-module/setup-module/room-table/room-table.component';
import { WarehouseComponent } from './components/sell-module/warehouse/warehouse.component';
import { WebsiteOrdersComponent } from './components/sell-module/website-orders/website-orders.component';
import {
  TimekeepingHistoryComponent
} from './components/timekeeping-module/timekeeping-history/timekeeping-history.component';
import {
  TimekeepingReportComponent
} from './components/timekeeping-module/timekeeping-report/timekeeping-report.component';
import { TimekeepingComponent } from './components/timekeeping-module/timekeeping/timekeeping.component';
import { ForgotPasswordComponent } from './components/unauthenticate-module/forgot-password/forgot-password.component';
import { LoginComponent } from './components/unauthenticate-module/login/login.component';
import { BranchWebComponent } from './components/website-module/branch-web/branch-web.component';
import { IntroWebComponent } from './components/website-module/intro-web/intro-web.component';
import { IntroduceEditComponent } from './components/website-module/intro-web/introduce-edit/introduce-edit.component';
import { MenuWebEditComponent } from './components/website-module/menu-web/menu-web-edit/menu-web-edit.component';
import { MenuWebComponent } from './components/website-module/menu-web/menu-web.component';
import { NewsEditComponent } from './components/website-module/news-web/news-edit/news-edit.component';
import { NewsWebComponent } from './components/website-module/news-web/news-web.component';
import { ProductEditComponent } from './components/website-module/product-web/product-edit/product-edit.component';
import { ProductWebComponent } from './components/website-module/product-web/product-web.component';
import { RecruitWebComponent } from './components/website-module/recruit-web/recruit-web.component';
import {
  RecruitmentEditComponent
} from './components/website-module/recruit-web/recruitment-edit/recruitment-edit.component';
import { SliderEditComponent } from './components/website-module/slider-web/slider-edit/slider-edit.component';
import { SliderWebComponent } from './components/website-module/slider-web/slider-web.component';
import { SocialNetworkWebComponent } from './components/website-module/social-network-web/social-network-web.component';
import { WorkflowTypeComponent } from './components/workflow-module/workflow-type/workflow-type.component';
import { WorkflowItemComponent } from './components/workflow-module/workflow/components/workflow-item.component';
import { WorkflowFormComponent } from './components/workflow-module/workflow/workflow-form/workflow-form.component';
import { WorkflowComponent } from './components/workflow-module/workflow/workflow.component';
import { AppConfigComponent } from './configs/app.config.component';
import { appInitializer } from './interceptor/app.initializer';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { SpinnerInterceptor } from './interceptor/spinner.interceptor';
import { AppFooterComponent } from './layouts/app.footer.component';
import { AppLayoutComponent } from './layouts/app.layout.component';
import { AppMainComponent } from './layouts/app.main.component';
import { AppMenuComponent } from './layouts/app.menu.component';
import { AppMenuitemComponent } from './layouts/app.menuitem.component';
import { AppSidebarComponent } from './layouts/app.sidebar.component';
import { AppTopBarComponent } from './layouts/app.topbar.component';
import { AuthService } from './service/auth.service';
import { ProductService } from './service/productservice';
import { ConfigService } from './service/system-setting/app.config.service';
import { MenuService } from './service/system-setting/app.menu.service';
import { IsConfirmationComponent } from './shared/is-confirmation/is-confirmation.component';
import { IsFunnelChartComponent } from './shared/is-funnel-chart/is-funnel-chart.component';
import { IsTableComponent } from './shared/is-table/is-table.component';
import { QlFormatsComponent } from './shared/ql-formats/ql-formats.component';
import { SpinnerOverlayComponent } from './shared/spinner-overlay/spinner-overlay.component';

// Print barcode module
import {
  GoodsPrintFormComponent
} from './components/sell-module/list-of-goods/goods-print-form/goods-print-form.component';
import {
  PrintItemComponent
} from './components/sell-module/list-of-goods/goods-print-form/print-item/print-item.component';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import { PrintItemModule } from './components/sell-module/list-of-goods/goods-print-form/print-item/print-item.module';

import { FormLayoutComponent } from "@app/shared/components/form-layout/form-layout.component";
import { TableLayoutComponent } from "@app/shared/components/table-layout/table-layout.component";
import { TableComponent } from "@app/shared/components/table/table.component";
import { SalaryCalculateComponent } from '@components/employee-module/salary-calculate/salary-calculate.component';
import {
  RequestingEquipmentFormComponent
} from "@components/procedure-module/requesting-equipment/requesting-equipment-form/requesting-equipment-form.component";
import {
  RequestingEquipmentComponent
} from "@components/procedure-module/requesting-equipment/requesting-equipment.component";
import {
  ProducePlanningRequestingPaymentFormComponent
} from "@components/procedure-module/requesting-payment-pass/requesting-payment-form/produce-planning-requesting-payment-form.component";
import { ReportModule } from "@components/report/report.module";
import {
  CarDeliveryFormComponent
} from "@components/sell-module/car-delivery/car-delivery-form/car-delivery-form.component";
import { BillPromotionComponent } from "@components/sell-module/components/bill-discount/bill-promotion.component";
import {
  GoodPromotionItemComponent
} from "@components/sell-module/good-promotion/add-goods-promotion-item/good-promotion-item.component";
import {
  ProduceOrderFormComponent
} from "@components/sell-module/produce-order/produce-order-form/produce-order-form.component";
import {
  ProduceOrderGoodDetailComponent
} from "@components/sell-module/produce-order/produce-order-good-detail/produce-order-good-detail.component";
import { ProduceOrderComponent } from "@components/sell-module/produce-order/produce-order.component";
import { ProducePlanningComponent } from "@components/sell-module/produce-planning/produce-planning.component";
import {
  SaleDepartmentSalaryReportComponent
} from "@components/sell-module/sell-report-module/sale-department-salary-report/sale-department-salary-report.component";
import {
  FaceDetectorComponent
} from '@components/timekeeping-module/timekeeping-checkin/face-detector/face-detetor.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccountV2Component } from './components/accounting-module/account-v2/account-v2.component';
import {
  AccountDetailFirstV2Component
} from './components/accounting-module/account-v2/components/account-detail-first-v2/account-detail-first-v2.component';
import {
  AccountDetailSecondV2Component
} from './components/accounting-module/account-v2/components/account-detail-second-v2/account-detail-second-v2.component';
import {
  AddAccountGroupSyncComponent
} from './components/accounting-module/account-v2/dialogs/add-edit-account-group/add-account-group-sync/add-account-group-sync.component';
import {
  AddEditAccountGroupComponent
} from './components/accounting-module/account-v2/dialogs/add-edit-account-group/add-edit-account-group.component';
import {
  AddEditAccountComponent
} from './components/accounting-module/account-v2/dialogs/add-edit-account/add-edit-account.component';
import {
  AllowanceUserDialogComponent
} from './components/accounting-module/allowance-user/allowance-user-dialog/allowance-user-dialog.component';
import {
  AllowanceUserFormComponent
} from './components/accounting-module/allowance-user/allowance-user-form/allowance-user-form.component';
import { AllowanceUserComponent } from './components/accounting-module/allowance-user/allowance-user.component';
import { AriseCrudV2Component } from './components/accounting-module/arise-v2/arise-crud-v2/arise-crud-v2.component';
import {
  AriseListFilterComponent
} from './components/accounting-module/arise-v2/arise-list-v2/arise-list-filter/arise-list-filter.component';
import { AriseListV2Component } from './components/accounting-module/arise-v2/arise-list-v2/arise-list-v2.component';
import { AriseV2Component } from './components/accounting-module/arise-v2/arise-v2.component';
import {
  AriseCrudMultipleV3Component
} from './components/accounting-module/arise-v3/arise-crud-multiple-v3/arise-crud-multiple-v3.component';
import { AriseCrudV3Component } from './components/accounting-module/arise-v3/arise-crud-v3/arise-crud-v3.component';
import { AriseV3Component } from './components/accounting-module/arise-v3/arise-v3.component';
import {
  AriseCrudDeliveryComponent
} from './components/accounting-module/arise-v3/components/arise-crud-delivery/arise-crud-delivery.component';
import {
  AriseCrudImportProductComponent
} from './components/accounting-module/arise-v3/components/arise-crud-import-product/arise-crud-import-product.component';
import {
  AriseCrudStockComponent
} from './components/accounting-module/arise-v3/components/arise-crud-stock/arise-crud-stock.component';
import {
  AriseCrudTaxComponent
} from './components/accounting-module/arise-v3/components/arise-crud-tax/arise-crud-tax.component';
import {
  AriseCrudVatComponent
} from './components/accounting-module/arise-v3/components/arise-crud-vat/arise-crud-vat.component';
import {
  AriseCrudMultipleV4Component
} from './components/accounting-module/arise-v4/arise-crud-multiple-v4/arise-crud-multiple-v4.component';
import { AriseCrudV4Component } from './components/accounting-module/arise-v4/arise-crud-v4/arise-crud-v4.component';
import {
  AriseListFilterV4Component
} from './components/accounting-module/arise-v4/arise-list-v4/arise-list-filter/arise-list-filter-v4.component';
import { AriseListV4Component } from './components/accounting-module/arise-v4/arise-list-v4/arise-list-v4.component';
import { AriseV4Component } from './components/accounting-module/arise-v4/arise-v4.component';
import { CcdcTscdComponent } from './components/accounting-module/arise/components/ccdc-tscd/ccdc-tscd.component';
import { EndOfTermDetailComponent } from './components/accounting-module/arise/components/end-of-term/end-of-term-detail/end-of-term-detail.component';
import {
  ProjectCrudComponent
} from './components/accounting-module/arise/components/project/project-crud/project-crud.component';
import { ProjectComponent } from './components/accounting-module/arise/components/project/project.component';
import {
  SearchAccountComponent
} from './components/accounting-module/arise/components/search-account/search-account.component';
import {
  AllowanceFormComponent
} from './components/accounting-module/category-module/allowance/allowance-form/allowance-form.component';
import { AllowanceComponent } from './components/accounting-module/category-module/allowance/allowance.component';
import {
  EndOfTermEndingFormComponent
} from './components/accounting-module/category-module/end-of-term-ending/end-of-term-ending-form/end-of-term-ending-form.component';
import {
  InstanceBillComponent
} from './components/accounting-module/category-module/instance-bill/instance-bill.component';
import { ConfigAriseComponent } from './components/accounting-module/config-arise/config-arise.component';
import {
  GeneralDiaryReportComponent
} from './components/accounting-module/general-diary-report/general-diary-report.component';
import {
  InternalRegisterReceiptDetailNewReportComponent
} from './components/accounting-module/internal-report-module/register-receipt-detail-new-report/internal-register-receipt-detail-new-report.component';
import {
  PeriodOverreachRegisterReceiptDetailComponent
} from './components/accounting-module/overreach-report-module/period-register-receipt-detail/period-overreach-register-receipt-detail.component';
import { TaxVatComponent } from './components/accounting-module/overreach-report-module/tax-vat/tax-vat.component';
import {
  ValueAddTaxComponent
} from './components/accounting-module/overreach-report-module/value-add-tax/value-add-tax.component';
import { ContractDepartmentModule } from './components/contract-department/contract-department.module';
import {
  BillHistoryCollectionsComponent
} from './components/customer-module/bill-history-collections/bill-history-collections.component';
import { CustomerWarningComponent } from './components/customer-module/customer-warning/customer-warning.component';
import {
  ChangeEmployeeComponent
} from './components/customer-module/customers/components/change-employee/change-employee.component';
import {
  ContactFormComponent
} from './components/customer-module/customers/components/contact-form/contact-form.component';
import {
  CustomerNotificationComponent
} from './components/customer-module/customers/components/customer-notification/customer-notification.component';
import {
  CustomerQuoteHistoryComponent
} from './components/customer-module/customers/components/customer-quote-history/customer-quote-history.component';
import { RegisterEmailComponent } from './components/customer-module/customers/register-email/register-email.component';
import { ApprovalProcessComponent } from './components/employee-module/approval-process/approval-process.component';
import { EmployeeModule } from './components/employee-module/employee.module';
import { FurloughFormComponent } from './components/employee-module/furlough/furlough-form/furlough-form.component';
import { FurloughComponent } from './components/employee-module/furlough/furlough.component';
import {
  GasolineNormsFormComponent
} from './components/employee-module/gasoline-norms/components/gasoline-norms-form/gasoline-norms-form.component';
import { GasolineNormsComponent } from './components/employee-module/gasoline-norms/gasoline-norms.component';
import { NamePipe } from './components/employee-module/gasoline-norms/name.pipe';
import {
  GeneralStatisticsInfoComponent
} from './components/employee-module/general-statistics/general-statistics-info/general-statistics-info.component';
import {
  ProcedureChangeShiftFormComponent
} from './components/employee-module/procedure-change-shift/procedure-change-shift-form/procedure-change-shift-form.component';
import {
  ProcedureChangeShiftComponent
} from './components/employee-module/procedure-change-shift/procedure-change-shift.component';
import {
  ProcedureRequestOvertimeFormComponent
} from './components/employee-module/procedure-request-overtime/procedure-request-overtime-form/procedure-request-overtime-form.component';
import {
  ProcedureRequestOvertimeComponent
} from './components/employee-module/procedure-request-overtime/procedure-request-overtime.component';
import {
  SalaryAdvanceAddFormComponent
} from './components/employee-module/salary-advance/components/salary-advance-add-form/salary-advance-add-form.component';
import {
  SalaryAdvanceFormComponent
} from './components/employee-module/salary-advance/components/salary-advance-form/salary-advance-form.component';
import { SalaryAdvanceComponent } from './components/employee-module/salary-advance/salary-advance.component';
import {
  SalaryLevelFormComponent
} from './components/employee-module/salary-level/components/salary-level-form/salary-level-form.component';
import { SalaryLevelComponent } from './components/employee-module/salary-level/salary-level.component';
import { MSalaryComponent } from './components/employee-module/salary/m-salary/m-salary.component';
import { ShiftSettingComponent } from './components/employee-module/shift-setting/shift-setting.component';
import {
  ToolsFixedAssetsUserFormComponent
} from './components/employee-module/tools-fixed-assets-user/tools-fixed-assets-user-form/tools-fixed-assets-user-form.component';
import {
  ToolsFixedAssetsUserComponent
} from './components/employee-module/tools-fixed-assets-user/tools-fixed-assets-user.component';
import {
  PrintContractComponent
} from './components/employee-module/user/components/print-contract/print-contract.component';
import { WorkingDayPipe } from './components/employee-module/working-days/working-day.pipe';
import {
  WorkingDaysFormComponent
} from './components/employee-module/working-days/working-days-form/working-days-form.component';
import { WorkingDaysComponent } from './components/employee-module/working-days/working-days.component';
import {
  WorkingHoursFormComponent
} from './components/employee-module/working-hours/working-hours-form/working-hours-form.component';
import { WorkingHoursComponent } from './components/employee-module/working-hours/working-hours.component';
import { HotelModule } from './components/hotel-module/hotel.module';
import { CustomerScoreComponent } from './components/kpi-module/customer-score/customer-score.component';
import {
  ReportKpiMchartComponent
} from './components/kpi-module/report-kpi/report-kpi-mchart/report-kpi-mchart.component';
import { ReportKpiComponent } from './components/kpi-module/report-kpi/report-kpi.component';
import {
  RevenueScoreFormComponent
} from './components/kpi-module/revenue-score/components/revenue-score-form/revenue-score-form.component';
import { RevenueScoreComponent } from './components/kpi-module/revenue-score/revenue-score.component';
import { SaveComponent } from './components/kpi-module/target-kpi/save/save.component';
import { TargetKpiComponent } from './components/kpi-module/target-kpi/target-kpi.component';
import {
  TimekeepingScoreFormComponent
} from './components/kpi-module/timekeeping-score/components/timekeeping-score-form/timekeeping-score-form.component';
import { TimekeepingScoreComponent } from './components/kpi-module/timekeeping-score/timekeeping-score.component';
import { EmployeeDashboardComponent } from './components/main-module/employee-dashboard/employee-dashboard.component';
import {
  CarCriteriaFormComponent
} from './components/materiall-management-module/car-criteria/car-criteria-form/car-criteria-form.component';
import { CarCriteriaComponent } from './components/materiall-management-module/car-criteria/car-criteria.component';
import { CarComponent } from './components/materiall-management-module/car/car.component';
import { CarFormComponent } from './components/materiall-management-module/car/components/car-form/car-form.component';
import {
  LicensePlatesFormComponent
} from './components/materiall-management-module/license-plates/license-plates-form/license-plates-form.component';
import {
  LicensePlatesComponent
} from './components/materiall-management-module/license-plates/license-plates.component';
import { MealSummaryComponent } from './components/materiall-management-module/number-of-meal/meal-summary/meal-summary.component';
import { NumberOfMealComponent } from './components/materiall-management-module/number-of-meal/number-of-meal.component';
import {
  OfficeAddFormComponent
} from './components/materiall-management-module/office-add/office-add-form/office-add-form.component';
import { OfficeAddComponent } from './components/materiall-management-module/office-add/office-add.component';
import { OfficeFormComponent } from './components/materiall-management-module/office/office-form/office-form.component';
import { OfficeComponent } from './components/materiall-management-module/office/office.component';
import { PetrolConsumptionComponent } from './components/materiall-management-module/petrol-consumption/petrol-consumption.component';
import { PolicePostFormComponent } from './components/materiall-management-module/police-post/police-post-form/police-post-form.component';
import { PolicePostComponent } from './components/materiall-management-module/police-post/police-post.component';
import { RouteFormComponent } from './components/materiall-management-module/route/route-form/route-form.component';
import { RouteComponent } from './components/materiall-management-module/route/route.component';
import {
  StationaryExportFormComponent
} from './components/materiall-management-module/stationary-export/stationary-export-form/stationary-export-form.component';
import {
  StationaryExportComponent
} from './components/materiall-management-module/stationary-export/stationary-export.component';
import { AdvancedPaymentFormComponent } from './components/procedure-module/advanced-payment-pass/advanced-payment-form/advanced-payment-form.component';
import { AdvancedPaymentPassComponent } from './components/procedure-module/advanced-payment-pass/advanced-payment-pass.component';
import { CarLocationFormComponent } from './components/procedure-module/car-location/car-location-form/car-location-form.component';
import { CarLocationComponent } from './components/procedure-module/car-location/car-location.component';
import { ExPlanFormComponent } from './components/procedure-module/expenditure-plan/ex-plan-form/ex-plan-form.component';
import { ExpenditurePlanComponent } from './components/procedure-module/expenditure-plan/expenditure-plan.component';
import { ExportProcessFormComponent } from './components/procedure-module/export-process/export-process-form/export-process-form.component';
import { ExportProcessComponent } from './components/procedure-module/export-process/export-process.component';
import { GatePassFormComponent } from './components/procedure-module/gate-pass/gate-pass-form/gate-pass-form.component';
import { GatePassComponent } from './components/procedure-module/gate-pass/gate-pass.component';
import { ImportProcessFormComponent } from './components/procedure-module/import-process/import-process-form/import-process-form.component';
import { ImportProcessComponent } from './components/procedure-module/import-process/import-process.component';
import { LedgerPaymentComponent } from './components/procedure-module/ledger-payment/ledger-payment.component';
import { LedgerReceiptComponent } from './components/procedure-module/ledger-receipt/ledger-receipt.component';
import {
  ProcessManagementFormComponent
} from './components/procedure-module/process-management/process-management-form/process-management-form.component';
import {
  ProcessManagementComponent
} from './components/procedure-module/process-management/process-management.component';
import {
  ProcessStepManagementComponent
} from './components/procedure-module/process-step-management/process-step-management.component';
import {
  ProcessStepMngFormComponent
} from './components/procedure-module/process-step-management/process-step-mng-form/process-step-mng-form.component';
import { RequestEquipmentOrderFormComponent } from './components/procedure-module/request-equipment-order/request-equipment-order-form/request-equipment-order-form.component';
import { RequestEquipmentOrderComponent } from './components/procedure-module/request-equipment-order/request-equipment-order.component';
import { ExpenditurePlanFormComponent } from './components/procedure-module/requesting-payment-pass/expenditure-plan-form/expenditure-plan-form.component';
import { RequestingPaymentFormComponent } from './components/procedure-module/requesting-payment-pass/requesting-payment-form/requesting-payment-form.component';
import { RequestingPaymentPassComponent } from './components/procedure-module/requesting-payment-pass/requesting-payment-pass.component';
import {
  BillNotificationComponent
} from './components/sell-module/cashier/components/bill-notification/bill-notification.component';
import { PrintBillComponent } from './components/sell-module/cashier/components/print-bill/print-bill.component';
import {
  AccountConnectionComponent
} from './components/sell-module/components/account-connection/account-connection.component';
import { BaogiaComponent } from './components/sell-module/components/baogia/baogia.component';
import { BillNoteComponent } from './components/sell-module/components/bill-table/bill-note/bill-note.component';
import {
  ViewPdfFileOnTabComponent
} from './components/sell-module/components/bill-table/view-pdf-file-on-tab/view-pdf-file-on-tab.component';
import {
  DeptNotificationComponent
} from './components/sell-module/components/dept-notification/dept-notification.component';
import { PxkV1Component } from './components/sell-module/components/pxk-v1/pxk-v1.component';
import { PxkComponent } from './components/sell-module/components/pxk/pxk.component';
import { QrScannerComponent } from './components/sell-module/components/qr-scanner/qr-scanner.component';
import { DebtCollectionComponent } from './components/sell-module/debt-collection/debt-collection.component';
import { DebtCollectionResolver } from './components/sell-module/debt-collection/debt-collection.resolver';
import { DriverFormComponent } from './components/sell-module/driver/driver-form/driver-form.component';
import { DriverComponent } from './components/sell-module/driver/driver.component';
import { GoodPromotionFormComponent } from './components/sell-module/good-promotion/good-promotion-form/good-promotion-form.component';
import { GoodPromotionComponent } from './components/sell-module/good-promotion/good-promotion.component';
import {
  GoodWarehouseExportFormComponent
} from './components/sell-module/good-warehouse-export/good-warehouse-export-form/good-warehouse-export-form.component';
import {
  GoodWarehouseExportComponent
} from './components/sell-module/good-warehouse-export/good-warehouse-export.component';
import {
  GoodWarehouseFloorsFormComponent
} from './components/sell-module/good-warehouse-floors/components/good-warehouse-floors-form/good-warehouse-floors-form.component';
import {
  GoodWarehouseFloorsComponent
} from './components/sell-module/good-warehouse-floors/good-warehouse-floors.component';
import {
  GoodWarehousePositionsFormComponent
} from './components/sell-module/good-warehouse-positions/components/good-warehouse-positions-form/good-warehouse-positions-form.component';
import {
  WarehousePositionsComponent
} from './components/sell-module/good-warehouse-positions/good-warehouse-positions.component';
import {
  GoodWarehouseShelvesFormComponent
} from './components/sell-module/good-warehouse-shelves/components/good-warehouse-shelves-form/good-warehouse-shelves-form.component';
import {
  GoodWarehouseShelvesComponent
} from './components/sell-module/good-warehouse-shelves/good-warehouse-shelves.component';
import {
  ReportGoodInWarehouseComponent
} from './components/sell-module/good-warehouses/good-warehouse-diagram/components/report-good-in-warehouse/report-good-in-warehouse.component';
import {
  GoodWarehouseDiagramComponent
} from './components/sell-module/good-warehouses/good-warehouse-diagram/good-warehouse-diagram.component';
import {
  GoodWarehousePositionComponent
} from './components/sell-module/good-warehouses/good-warehouse-position/good-warehouse-position.component';
import {
  GoodWarehousesFormComponent
} from './components/sell-module/good-warehouses/good-warehouses-form/good-warehouses-form.component';
import { GoodWarehousesComponent } from './components/sell-module/good-warehouses/good-warehouses.component';
import { PrintQrComponent } from './components/sell-module/good-warehouses/print-qr/print-qr.component';
import { GoodFormComponent } from './components/sell-module/goods/good-form/good-form.component';
import { GoodsComponent } from './components/sell-module/goods/goods.component';
import {
  BillGoodsNotificationComponent
} from './components/sell-module/import-goods/components/bill-goods-notification/bill-goods-notification.component';
import {
  BillGoodsTableComponent
} from './components/sell-module/import-goods/components/bill-goods-table/bill-goods-table.component';
import {
  ViewGoodsPdfFileOnTabComponent
} from './components/sell-module/import-goods/components/bill-goods-table/view-pdf-file-on-tab/view-goods-pdf-file-on-tab.component';
import {
  ImportGoodsTableComponent
} from './components/sell-module/import-goods/components/import-goods-table/import-goods-table.component';
import {
  PrintBillGoodsComponent
} from './components/sell-module/import-goods/components/print-bill-goods/print-bill-goods.component';
import { ImportGoodsComponent } from './components/sell-module/import-goods/import-goods.component';
import {
  ImportStockDetailComponent
} from './components/sell-module/import-stock/components/import-stock-detail/import-stock-detail.component';
import {
  ImportStockGoodsTableComponent
} from './components/sell-module/import-stock/components/import-stock-goods-table/import-stock-goods-table.component';
import { ImportStockComponent } from './components/sell-module/import-stock/import-stock.component';
import { NewOrderGoodDetailComponent } from './components/sell-module/order-new/new-order-good-detail/new-order-good-detail.component';
import { OrderNewComponent } from './components/sell-module/order-new/order-new.component';
import { OrderQuoteFormComponent } from './components/sell-module/order-quote/order-quote-form/order-quote-form.component';
import { OrderQuoteComponent } from './components/sell-module/order-quote/order-quote.component';
import { OrderComponent } from './components/sell-module/order/order.component';
import { PriceListComponent } from './components/sell-module/price-list/price-list.component';
import { PrinterParametersComponent } from './components/sell-module/printer-parameters/printer-parameters.component';
import { NewProductFormComponent } from './components/sell-module/produce-order/new-product-form/new-product-form.component';
import { PlanningGoodDetailComponent } from './components/sell-module/produce-planning-warehouse/planning-good-detail/planning-good-detail.component';
import { ProducePlanningWarehouseFormComponent } from './components/sell-module/produce-planning-warehouse/produce-planning-warehouse-form/produce-planning-warehouse-form.component';
import { ProducePlanningWarehouseComponent } from './components/sell-module/produce-planning-warehouse/produce-planning-warehouse.component';
import { ProducePlanningFormComponent } from './components/sell-module/produce-planning/produce-planning-form/produce-planning-form.component';
import { ProductionDepartmentFormComponent } from './components/sell-module/production-department/production-department-form/production-department-form.component';
import { ProductionDepartmentComponent } from './components/sell-module/production-department/production-department.component';
import { SaleDiscountFormComponent } from './components/sell-module/sale-discount/sale-discount-form/sale-discount-form.component';
import { SaleDiscountComponent } from './components/sell-module/sale-discount/sale-discount.component';
import {
  BillRefundComponent
} from './components/sell-module/sell-report-module/payment-history/components/bill-refund/bill-refund.component';
import {
  SaleByGoodCustomerReportComponent
} from './components/sell-module/sell-report-module/sale-by-good-customer-report/sale-by-good-customer-report.component';
import {
  SaleByGoodEmployeeReportComponent
} from './components/sell-module/sell-report-module/sale-by-good-employee-report/sale-by-good-employee-report.component';
import {
  SaleByGoodReportComponent
} from './components/sell-module/sell-report-module/sale-by-good-report/sale-by-good-report.component';
import {
  AccountLinkFormComponent
} from './components/sell-module/setup-module/accounting-link/account-link-form/account-link-form.component';
import {
  ChartOfAccountFiltersComponent
} from './components/sell-module/setup-module/chart-of-account-filters/chart-of-account-filters.component';
import {
  ChartOfAccountFiltersFormComponent
} from './components/sell-module/setup-module/chart-of-account-filters/component/chart-of-account-filters-form/chart-of-account-filters-form.component';
import { ComboFormComponent } from './components/sell-module/setup-module/combo/combo-form/combo-form.component';
import {
  ComparePriceListComponent
} from './components/sell-module/setup-module/compare-price-list/compare-price-list.component';
import { GoodQuotaStepFormComponent } from './components/sell-module/setup-module/good-quota-step/good-quota-step-form/good-quota-step-form.component';
import { GoodQuotaStepComponent } from './components/sell-module/setup-module/good-quota-step/good-quota-step.component';
import {
  GoodsQuotaFormComponent
} from './components/sell-module/setup-module/goods-quota/goods-quota-form/goods-quota-form.component';
import {
  GoodsQuotaRecipeFormComponent
} from './components/sell-module/setup-module/goods-quota/goods-quota-recipes/goods-quota-recipe-form/goods-quota-recipe-form.component';
import {
  GoodsQuotaRecipesComponent
} from './components/sell-module/setup-module/goods-quota/goods-quota-recipes/goods-quota-recipes.component';
import { GoodsQuotaComponent } from './components/sell-module/setup-module/goods-quota/goods-quota.component';
import {
  InventoryFormComponent
} from './components/sell-module/setup-module/inventory/inventory-form/inventory-form.component';
import { InventoryComponent } from './components/sell-module/setup-module/inventory/inventory.component';
import {
  ManufactureFormComponent
} from './components/sell-module/setup-module/manufacture/manufacture-form/manufacture-form.component';
import { ManufactureComponent } from './components/sell-module/setup-module/manufacture/manufacture.component';
import {
  AddPriceListComponent
} from './components/sell-module/setup-module/menu-of-goods/component/add-price-list/add-price-list.component';
import {
  ComparePricesComponent
} from './components/sell-module/setup-module/menu-of-goods/component/compare-prices/compare-prices.component';
import { QuotaFormComponent } from './components/sell-module/setup-module/quota/quota-form/quoa-form.component';
import { TableQrGeneratorComponent } from './components/sell-module/setup-module/room-table/component/table-qr-generator/table-qr-generator.component';
import {
  SurChargesFormComponent
} from './components/sell-module/setup-module/surcharges/sur-charges-form/sur-charges-form.component';
import { SurchargesComponent } from './components/sell-module/setup-module/surcharges/surcharges.component';
import { TillFormComponent } from './components/sell-module/till/till-form/till-form.component';
import { TillComponent } from './components/sell-module/till/till.component';
import { TransferStockComponent } from './components/sell-module/transfer-stock/transfer-stock.component';
import { SaveSendMailComponent } from './components/send-mail/save-send-mail/save-send-mail.component';
import { SendMailComponent } from './components/send-mail/send-mail.component';
import { StandardFormApplicationComponent } from './components/standard-form/standard-form-application/standard-form-application.component';
import { StandardFormComponent } from './components/standard-form/standard-form.component';
import {
  TimekeepingCheckinComponent
} from './components/timekeeping-module/timekeeping-checkin/timekeeping-checkin.component';
import { RoleEditComponent } from './components/unauthenticate-module/role/role-edit/role-edit.component';
import { RoleComponent } from './components/unauthenticate-module/role/role.component';
import {
  UserRoleEditComponent
} from './components/unauthenticate-module/user-role/user-role-edit/user-role-edit.component';
import { UserRoleComponent } from './components/unauthenticate-module/user-role/user-role.component';
import {
  BranchWebEditComponent
} from './components/website-module/branch-web/branch-web-edit/branch-web-edit.component';
import { EventFormComponent } from './components/website-module/events-web/event-form/event-form.component';
import { EventsWebComponent } from './components/website-module/events-web/events-web.component';
import {
  IsoftHistoryEditComponent
} from './components/website-module/isoft-history/isoft-history-edit/isoft-history-edit.component';
import { IsoftHistoryComponent } from './components/website-module/isoft-history/isoft-history.component';
import { PromotionComponent } from './components/website-module/promotion/inventory.component';
import { PromotionFormComponent } from './components/website-module/promotion/promotion-form/promotion-form.component';
import {
  SocialNetworkEditComponent
} from './components/website-module/social-network-web/social-network-edit/social-network-edit.component';
import {
  WorkflowStatusFormComponent
} from './components/workflow-module/workflow-status/workflow-status-form/workflow-status-form.component';
import { WorkflowStatusComponent } from './components/workflow-module/workflow-status/workflow-status.component';
import { WorkTypeFormComponent } from './components/workflow-module/workflow-type/component/work-type-form.component';
import {
  ChangeWorkflowStatusComponent
} from './components/workflow-module/workflow/components/change-workflow-status.component';
import { WorkflowItemsComponent } from './components/workflow-module/workflow/components/workflow-items.component';
import { WorkflowProcessComponent } from './components/workflow-module/workflow/components/workflow-process.component';
import { NotificationComponent } from './layouts/components/notification/notification.component';
import { ProjectCodeService } from './service/project.service';
import { DataTableComponent } from './shared/components/data-table/data-table.component';
import { DialogLayoutComponent } from './shared/components/dialog-layout/dialog-layout.component';
import { GenderViewComponent } from './shared/components/gender-view/gender-view.component';
import { ImageDialogComponent } from './shared/components/image-dialog/image-dialog.component';
import { ListOfTaxRatesComponent } from './shared/components/list-of-tax-rates/list-of-tax-rates.component';
import { MultipleUploadComponent } from './shared/components/multiple-upload/multiple-upload.component';
import { CustomerPricesComponent } from './shared/components/price/customer-prices.component';
import { ProcedureBoardComponent } from './shared/components/procedure-board/procedure-board.component';
import { ProcedureFilterComponent } from './shared/components/procedure-filter/procedure-filter.component';
import { TabMenuComponent } from './shared/components/tab-menu/tab-menu.component';
import { TitleCaseInputDirective } from './shared/directives/titlecase-input.directive';
import { QlFormatsBasicComponent } from './shared/ql-formats-basic/ql-formats-basic.component';
import { SharedModule } from './shared/shared/shared.module';
import {
  RequestEquipmentOrderForTestFormComponent
} from "@components/procedure-module/request-equipment-order-for-test/request-equipment-order-for-test-form/request-equipment-order-for-test-form.component";
import {
  RequestEquipmentOrderForTestComponent
} from "@components/procedure-module/request-equipment-order-for-test/request-equipment-order-for-test.component";

export function createTranslateLoader(http: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(http), 'assets/i18n/', '.json');
}

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

@NgModule({
  declarations: [
    // others component
    ProjectComponent,
    ContactFormComponent,
    ProjectCrudComponent,
    AriseCrudImportProductComponent,
    AriseCrudVatComponent,
    AriseCrudTaxComponent,
    AriseCrudDeliveryComponent,
    AriseCrudStockComponent,
    AccountV2Component,
    AppComponent,
    AppMainComponent,
    AppLayoutComponent,
    AppSidebarComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppConfigComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    DashboardComponent,
    EmployeeDashboardComponent,
    SpinnerOverlayComponent,
    EmptyComponent,
    CrudComponent,
    TimelineComponent,
    LandingComponent,
    ErrorComponent,
    NotfoundComponent,
    AccessComponent,
    QlFormatsComponent,
    QlFormatsBasicComponent,
    //unauthenticate component
    ForgotPasswordComponent,
    LoginComponent,
    // main component
    CompanyComponent,
    CompanyFormComponent,
    BeginDeclareComponent,
    BeginDeclareFormComponent,
    // employee component
    BranchComponent,
    BranchFormComponent,
    DepartmentComponent,
    DepartmentFormComponent,
    EmployeeTypeComponent,
    JobTitleDetailsComponent,
    SpecializedComponent,
    StoreComponent,
    StoreFormComponent,
    ShiftComponent,
    OfficeComponent,
    OfficeAddComponent,
    OfficeAddFormComponent,
    OfficeFormComponent,
    TimekeepingPositionComponent,
    TitleComponent,
    UserComponent,
    UserFormComponent,
    GeneralStatisticsComponent,
    SalarySocailFormComponent,
    SalaryAdvanceComponent,
    SalaryAdvanceFormComponent,
    SalaryAdvanceAddFormComponent,
    CarComponent,
    CarFormComponent,
    GasolineNormsComponent,
    GasolineNormsFormComponent,
    NamePipe,
    StationaryExportComponent,
    StationaryExportFormComponent,
    // relationship module
    RelativesComponent,
    RelationComponent,
    RelationFormComponent,
    RelativesFormComponent,
    // customer module
    CustomersComponent,
    CustomersFormComponent,
    ContactHistoryFormComponent,
    CustomerHistoriesComponent,
    CustomerTypeComponent,
    CustomerTypeFormComponent,
    CustomerStatusComponent,
    CustomerStatusFormComponent,
    CustomerJobComponent,
    CustomerJobFormComponent,
    BillHistoryCollectionsComponent,
    CustomerWarningComponent,
    // timekeeping module
    TimekeepingComponent,
    TimekeepingHistoryComponent,
    TimekeepingReportComponent,
    // workflow module
    WorkflowComponent,
    WorkflowFormComponent,
    WorkflowTypeComponent,
    WorkflowItemComponent,
    WorkflowItemsComponent,
    // sell module
    CashierComponent,
    ImportGoodsComponent,
    PrintBillComponent,
    PrintBillGoodsComponent,
    BillGoodsNotificationComponent,
    SellerComponent,
    TillComponent,
    TillFormComponent,
    WarehouseComponent,
    WebsiteOrdersComponent,
    ListOfGoodsComponent,
    GoodsFormComponent,
    GoodsTableComponent,
    ImportGoodsTableComponent,
    DeskTableComponent,
    BillTableComponent,
    BillGoodsTableComponent,
    PxkComponent,
    BaogiaComponent,
    PxkV1Component,
    QrScannerComponent,
    // setup module
    RoomTableComponent,
    RoomTableFormComponent,
    ChartOfAccountFiltersComponent,
    ChartOfAccountFiltersFormComponent,
    SurChargesFormComponent,
    QuotaComponent,
    QuotaFormComponent,
    ComboComponent,
    ComboFormComponent,
    MenuOfGoodsComponent,
    MenuOfGoodsFormComponent,
    SurchargesComponent,
    AddPriceListComponent,
    ComparePricesComponent,
    InventoryControlComponent,
    DefectiveGoodsComponent,
    AccountingLinkComponent,
    AccountLinkFormComponent,
    ComparePriceListComponent,
    // sell report module
    PaymentHistoryComponent,
    ProfitBeforeTaxComponent,
    ProfitAfterTaxComponent,
    SellDetailsBookComponent,
    SaleByGoodCustomerReportComponent,
    SaleByGoodReportComponent,
    SaleByGoodEmployeeReportComponent,
    SaleDepartmentSalaryReportComponent,

    // accounting module
    ReportFilterComponent,
    RemovePayerComponent,
    RemoveDescriptionComponent,
    EditOrderComponent,
    ConvertOverreachComponent,
    ConvertInternalComponent,
    CostEntryComponent,
    CcdcComponent,
    TscdComponent,
    CcdcTscdComponent,
    EndOfTermComponent,
    SalaryTranferComponent,
    SearchAccountComponent,
    ToolsFixedAssetsComponent,
    ToolsFixedAssetsFormComponent,
    AddEditAccountComponent,
    // AddEditAccountDetailsComponent,
    AddEditAccountGroupComponent,
    AddAccountGroupSyncComponent,
    InternalBalanceAccountComponent,
    OverreachBalanceAccountComponent,
    InternalReceiptComponent,
    OverreachReceiptComponent,
    InternalReceiptListComponent,
    OverreachReceiptListComponent,
    InternalLedgerComponent,
    OverreachLedgerComponent,
    InternalRegisterReceiptComponent,
    OverreachRegisterReceiptComponent,
    InternalRegisterReceiptDetailComponent,
    InternalRegisterReceiptDetailNewReportComponent,
    OverreachRegisterReceiptDetailComponent,
    InternalBalanceAccountantComponent,
    OverreachBalanceAccountantComponent,
    InternalSavedCurrencyComponent,
    OverreachSavedCurrencyComponent,
    InternalPlanMissionCountryTaxComponent,
    OverreachPlanMissionCountryTaxComponent,
    PTComponent,
    PCComponent,
    PCKComponent,
    PNComponent,
    PXComponent,
    PNPCComponent,
    PXNComponent,
    // category module
    TypeOfDocumentComponent,
    TypeOfDocumentFormComponent,
    BillsComponent,
    BillsFormComponent,
    EndOfTermEndingComponent,
    EndOfTermEndingFormComponent,
    // document module
    IncomingTextComponent,
    IncomingTextFormComponent,
    TextGoComponent,
    //kpi module
    TimekeepingScoreFormComponent,
    TimekeepingScoreComponent,
    RevenueScoreComponent,
    RevenueScoreFormComponent,
    CustomerScoreComponent,
    // website module
    SliderWebComponent,
    SliderEditComponent,
    IntroWebComponent,
    IntroduceEditComponent,
    ProductWebComponent,
    ProductEditComponent,
    BranchWebComponent,
    RecruitWebComponent,
    NewsWebComponent,
    SocialNetworkWebComponent,
    EmployeeTypeFormComponent,
    SpecializedFormComponent,
    TitleFormComponent,
    ShiftFormComponent,
    TimekeepingPositionFormComponent,
    JobTitleDetailsFormComponent,
    MenuWebComponent,
    MenuWebEditComponent,
    // Shared Components
    IsTableComponent,
    TextGoFormComponent,
    DocumentTypeComponent,
    DocumentTypeFormComponent,
    // IsDropdownComponent,
    IsConfirmationComponent,
    IsFunnelChartComponent,
    DecideComponent,
    DecideFormComponent,
    AchievementsComponent,
    AchievementFormComponent,
    // IsInputComponent,
    NewsEditComponent,
    RecruitmentEditComponent,
    SalaryComponent,
    MSalaryComponent,
    SalarySocialComponent,
    GoodsPrintFormComponent,
    PrintItemComponent,
    GeneralStatisticsInfoComponent,
    RoleComponent,
    RoleEditComponent,
    TaxVatComponent,
    UserRoleComponent,
    UserRoleEditComponent,
    WorkTypeFormComponent,
    InventoryComponent,
    PriceListComponent,
    SocialNetworkEditComponent,
    BranchWebEditComponent,
    QrScannerComponent,
    InstanceBillComponent,
    ValueAddTaxComponent,
    IsoftHistoryComponent,
    IsoftHistoryEditComponent,
    AllowanceComponent,
    AllowanceFormComponent,
    // Shared Components
    IsTableComponent,
    TextGoFormComponent,
    DocumentTypeComponent,
    DocumentTypeFormComponent,
    // IsDropdownComponent,
    IsConfirmationComponent,
    IsFunnelChartComponent,
    DecideComponent,
    DecideFormComponent,
    AchievementsComponent,
    AchievementFormComponent,
    // IsInputComponent,
    NewsEditComponent,
    RecruitmentEditComponent,
    SalaryComponent,
    SalarySocialComponent,
    GoodsPrintFormComponent,
    PrintItemComponent,
    GeneralStatisticsInfoComponent,
    RoleComponent,
    RoleEditComponent,
    TaxVatComponent,
    UserRoleComponent,
    UserRoleEditComponent,
    WorkTypeFormComponent,
    InventoryComponent,
    PriceListComponent,
    SocialNetworkEditComponent,
    BranchWebEditComponent,
    QrScannerComponent,
    InstanceBillComponent,
    ValueAddTaxComponent,
    IsoftHistoryComponent,
    IsoftHistoryEditComponent,
    AllowanceComponent,
    AllowanceFormComponent,
    AllowanceUserComponent,
    AllowanceUserFormComponent,
    AllowanceUserDialogComponent,
    ToolsFixedAssetsUserComponent,
    ToolsFixedAssetsUserFormComponent,
    GoodsComponent,
    // Good warehouse
    GoodWarehousesComponent,
    PrintQrComponent,
    GoodWarehousesFormComponent,
    // KPI module
    TargetKpiComponent,
    ReportKpiComponent,
    GoodFormComponent,
    SaveComponent,
    FurloughComponent,
    FurloughFormComponent,
    InventoryFormComponent,
    GoodWarehouseExportComponent,
    GoodWarehouseExportFormComponent,
    ViewPdfFileOnTabComponent,
    ViewGoodsPdfFileOnTabComponent,
    CustomerQuoteHistoryComponent,
    GeneralDiaryReportComponent,
    DebtCollectionComponent,
    PrinterParametersComponent,
    ConfigAriseComponent,
    SendMailComponent,
    SaveSendMailComponent,
    ChangeEmployeeComponent,
    PromotionComponent,
    PromotionFormComponent,
    AccountDetailFirstV2Component,
    AccountDetailSecondV2Component,
    AriseListV2Component,
    AriseListV4Component,
    AriseCrudV2Component,
    AriseCrudV4Component,
    AriseV2Component,
    AriseV3Component,
    AriseV4Component,
    AriseCrudV3Component,
    AriseListFilterComponent,
    AriseListFilterV4Component,
    ChangeWorkflowStatusComponent,
    WorkflowProcessComponent,
    GoodWarehouseDiagramComponent,
    GoodWarehouseShelvesComponent,
    GoodWarehouseShelvesFormComponent,
    GoodWarehouseFloorsComponent,
    GoodWarehouseFloorsFormComponent,
    GoodWarehousePositionComponent,
    GoodWarehousePositionsFormComponent,
    WarehousePositionsComponent,
    AriseCrudMultipleV3Component,
    AriseCrudMultipleV4Component,
    ReportGoodInWarehouseComponent,
    NotificationComponent,
    ProjectComponent,
    ProjectCrudComponent,
    PrintContractComponent,
    SalaryLevelFormComponent,
    SalaryLevelComponent,
    BillRefundComponent,
    PeriodOverreachRegisterReceiptDetailComponent,
    CustomerPricesComponent,
    ImportStockComponent,
    ImportStockDetailComponent,
    ImportStockGoodsTableComponent,
    BillNotificationComponent,
    ListOfTaxRatesComponent,
    QlFormatsBasicComponent,
    ManufactureComponent,
    ManufactureFormComponent,
    WorkflowStatusComponent,
    WorkflowStatusFormComponent,
    ReportKpiMchartComponent,
    CustomerNotificationComponent,
    DeptNotificationComponent,
    AccountConnectionComponent,
    EventsWebComponent,
    EventFormComponent,
    GenderViewComponent,
    TimekeepingCheckinComponent,
    GoodsQuotaComponent,
    GoodsQuotaRecipesComponent,
    GoodsQuotaRecipeFormComponent,
    GoodsQuotaFormComponent,
    LicensePlatesComponent,
    LicensePlatesFormComponent,
    CarCriteriaComponent,
    CarCriteriaFormComponent,
    RegisterEmailComponent,
    ProcessManagementComponent,
    ProcessManagementFormComponent,
    ProcessStepManagementComponent,
    ProcessStepMngFormComponent,
    WorkingHoursComponent,
    WorkingHoursFormComponent,
    WorkingDaysComponent,
    WorkingDaysFormComponent,
    WorkingDayPipe,
    ProcedureRequestOvertimeComponent,
    ProcedureRequestOvertimeFormComponent,
    OrderComponent,
    ProcedureChangeShiftComponent,
    ProcedureChangeShiftFormComponent,
    TransferStockComponent,
    ShiftSettingComponent,
    OrderNewComponent,
    TableQrGeneratorComponent,
    BillPromotionComponent,
    DataTableComponent,
    GoodQuotaStepComponent,
    GoodQuotaStepFormComponent,
    ProducePlanningFormComponent,
    ProducePlanningComponent,
    ProducePlanningWarehouseComponent,
    ProducePlanningWarehouseFormComponent,
    PlanningGoodDetailComponent,
    GatePassComponent,
    ProduceOrderFormComponent,
    ProduceOrderComponent,
    ProduceOrderGoodDetailComponent,
    AdvancedPaymentPassComponent,
    AdvancedPaymentFormComponent,
    GatePassFormComponent,
    RequestingPaymentPassComponent,
    RequestingPaymentFormComponent,
    StandardFormComponent,
    StandardFormApplicationComponent,
    TabMenuComponent,
    GoodPromotionComponent,
    GoodPromotionFormComponent,
    GoodPromotionItemComponent,
    CarDeliveryFormComponent,
    ProducePlanningRequestingPaymentFormComponent,
    RequestingEquipmentComponent,
    RequestingEquipmentFormComponent,
    NumberOfMealComponent,
    AppTemplate,
    TableLayoutComponent,
    FormLayoutComponent,
    TableComponent,
    DialogLayoutComponent,
    BillNoteComponent,
    ProductionDepartmentComponent,
    ProductionDepartmentFormComponent,
    NewOrderGoodDetailComponent,
    MealSummaryComponent,
    RouteComponent,
    RouteFormComponent,
    PolicePostComponent,
    PolicePostFormComponent,
    EndOfTermDetailComponent,
    ExpenditurePlanComponent,
    SaleDiscountComponent,
    SaleDiscountFormComponent,
    SalaryTypeComponent,
    SalaryTypeFormComponent,
    WorkerSalaryComponent,
    WorkerSalaryFormComponent,
    MultipleUploadComponent,
    ExpenditurePlanFormComponent,
    CarLocationComponent,
    CarLocationFormComponent,
    NewProductFormComponent,
    DriverComponent,
    DriverFormComponent,
    ExPlanFormComponent,
    ImportProcessComponent,
    ExportProcessComponent,
    ExportProcessFormComponent,
    ImportProcessFormComponent,
    ImageDialogComponent,
    RequestEquipmentOrderComponent,
    RequestEquipmentOrderForTestFormComponent,
    RequestEquipmentOrderForTestComponent,
    RequestEquipmentOrderFormComponent,
    OrderQuoteComponent,
    OrderQuoteFormComponent,
    ProcedureFilterComponent,
    ProcedureBoardComponent,
    SalaryTypeComponent,
    SalaryCalculateComponent,
    LoadingComponent,
    ApprovalProcessComponent,
    LedgerReceiptComponent,
    LedgerPaymentComponent,
    FaceDetectorComponent,
    PetrolConsumptionComponent
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ProductService,
    ProjectCodeService,
    MenuService,
    ConfigService,
    MessageService,
    ConfirmationService,
    DialogService,
    DebtCollectionResolver,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AccordionModule,
    AutoCompleteModule,
    AvatarModule,
    AvatarGroupModule,
    ProgressSpinnerModule,
    BadgeModule,
    BreadcrumbModule,
    EditorModule,
    CalendarModule,
    CardModule,
    FocusTrapModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    SpeedDialModule,
    ChipsModule,
    ChipModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DividerModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    ImageModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    KnobModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    OverlayModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    ScrollPanelModule,
    ScrollTopModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SplitButtonModule,
    SplitterModule,
    StepsModule,
    TagModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    VirtualScrollerModule,
    StyleClassModule,
    ZXingScannerModule,
    TranslateModule.forRoot({
      defaultLanguage: 'vn',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend],
      },
    }),
    DragDropModule,
    FullCalendarModule,
    NgxBarcodeModule,
    PrintItemModule,
    QRCodeModule,
    ContractDepartmentModule,
    EmployeeModule,
    NgOptimizedImage,
    HotelModule,
    TitleCaseInputDirective,
    ReportModule,
    InputNumberModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [AddEditAccountComponent, DataTableComponent],
})
export class AppModule {
  constructor(private primeNGConfig: PrimeNGConfig) {
    // Set default options for p-calendar
    this.primeNGConfig.setTranslation({
      dateFormat: 'dd/mm/yy',
    });
  }
}
