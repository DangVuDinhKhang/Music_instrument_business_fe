import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { StatisticService } from './statistic.service';

@Component({
  selector: 'app-manage-statistic',
  templateUrl: './manage-statistic.component.html',
  styleUrls: ['./manage-statistic.component.scss']
})
export class ManageStatisticComponent implements OnInit{

  revenue: any = [];

  revenueInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  costInChart = [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000];
  labels: any = [];

  selectedOption = 0;

  totalMember = 0;
  totalRating = 0;
  totalOrder = 0;

  constructor(private statisticService: StatisticService){}

  ngOnInit(): void {
    this.statisticRevenue("month");
    this.statisticMember();
    this.statisticRating();
    this.statisticOrder();
  }

  onSelectChange(){
    if(this.selectedOption == 0)
      this.statisticRevenue("month");
    else if(this.selectedOption == 1)
      this.statisticRevenue("day");
    
  }

  statisticMember(){
    this.statisticService.statisticMember().subscribe((response)=>{
      this.totalMember = response;
    })
  }

  statisticRating(){
    this.statisticService.statisticRating().subscribe((response)=>{
      this.totalRating = response;
    })
  }

  statisticOrder(){
    this.statisticService.statisticOrder().subscribe((response)=>{
      this.totalOrder = response;
    })
  }

  statisticRevenue(type: string){
    if(type == "month"){
      this.statisticService.statisticRevenueByMonth().subscribe((response)=>{
        const outputArray = response.map(([date, total]: any) => {
          const month = new Date(date).getMonth() + 1; // Lấy phần tháng và cộng thêm 1 vì tháng bắt đầu từ 0
          return { month, total };
        });
      
        outputArray.map((output: any)=>{
          this.revenueInChart[output.month - 1] = output.total;
        })
        this.labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
          'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',]
        this.configureChart();
      })
    }
    else{
      this.statisticService.statisticRevenueByDay().subscribe((response)=>{
        let outputArray = response.map((item: any) => ({
          date: item[0],
          total: item[1]
        }));

        const currentDate = new Date();
        // Lấy ngày trong tuần (0 là Chủ Nhật, 1 là Thứ Hai, ..., 6 là Thứ Bảy)
        const currentDayOfWeek = currentDate.getDay();
        // Tính ngày bắt đầu của tuần trước + 1 (ngày thứ Hai của tuần trước)
        const startDateOfLastWeek = new Date(currentDate);
        startDateOfLastWeek.setDate(currentDate.getDate() - currentDayOfWeek); // -6 để lùi về thứ Hai của tuần trước
        // Tạo mảng chứa danh sách các ngày từ startDateOfLastWeek đến currentDate
        const dateList = [];
        for (let date = startDateOfLastWeek; date <= currentDate; date.setDate(date.getDate() + 1)) {
            dateList.push(new Date(date));
        }
        // Định dạng lại các ngày thành chuỗi "YYYY-MM-DD"
        const formattedDateList = dateList.map(date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });

        
      
        for(let i = 0; i < formattedDateList.length; i++)
          for(let j = 0; j < outputArray.length; j++)
            if(outputArray[j].date == formattedDateList[i])
              this.revenueInChart[i] = outputArray[j].total;

        
        const formattedLabels = dateList.map(date => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${day}-${month}-${year}`;
        });
        this.labels = formattedLabels

        this.configureChart();
      })
    }
    
  }

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: [
      { data: this.revenueInChart, label: 'Doanh thu' },
      { data: this.costInChart, label: 'Chi tiêu' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true  ,
  };

  configureChart() {
    this.barChartData = {
      labels: this.labels,
      datasets: [
        { data: this.revenueInChart, label: 'Doanh thu' },
        { data: this.costInChart, label: 'Chi tiêu' }
      ]
    };
  }
}
