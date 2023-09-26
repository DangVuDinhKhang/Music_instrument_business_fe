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
  costInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  labels: any = [];

  selectedOption = 0;

  totalMember = 0;
  totalRating = 0;
  totalOrder = 0;
  totalProfit = 0;

  constructor(private statisticService: StatisticService){}

  ngOnInit(): void {
    this.statisticRevenue("month");
    this.statisticMember();
    this.statisticRating();
    this.statisticOrder();
    this.statisticProfit();
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

  statisticProfit(){
    this.statisticService.statisticTotalRevenue().subscribe((revenue)=>{
      this.statisticService.statisticTotalSpeding().subscribe((spending)=>{
        this.totalProfit = revenue - spending;
      })
    })
  }

  statisticRevenue(type: string){
    if(type == "month"){
      this.revenueInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.costInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.statisticService.statisticRevenueByMonth().subscribe((revenueMonth)=>{
        const revenueByMonth = revenueMonth.map(([date, total]: any) => {
          const month = new Date(date).getMonth() + 1; // Lấy phần tháng và cộng thêm 1 vì tháng bắt đầu từ 0
          return { month, total };
        });
      
        revenueByMonth.map((output: any)=>{
          this.revenueInChart[output.month - 1] = output.total;
        })
        this.statisticService.statisticSpendingByMonth().subscribe((spendingMonth)=>{
          const costByMonth = spendingMonth.map(([date, total]: any) => {
            const month = new Date(date).getMonth() + 1; // Lấy phần tháng và cộng thêm 1 vì tháng bắt đầu từ 0
            return { month, total };
          });
          costByMonth.map((output: any)=>{
            this.costInChart[output.month - 1] = output.total;
          })
          this.labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',]
          this.configureChart();
        })
        
      })
    }
    else{
      this.revenueInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.costInChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.statisticService.statisticRevenueByDay().subscribe((revenueDate)=>{
        let revenueByDate = revenueDate.map((item: any) => ({
          date: item[0],
          total: item[1]
        }));

        this.statisticService.statisticSpendingByDay().subscribe((spendingDate)=>{
          let spendingByDate = spendingDate.map((item: any) => ({
            date: item[0],
            total: item[1]
          }));
          const currentDate = new Date();

          const tomorrowDate = currentDate.setDate(currentDate.getDate() + 1);
          
          const dayInLastWeek = new Date(tomorrowDate);
          dayInLastWeek.setDate(dayInLastWeek.getDate() - 7);
          
          const dateList = [];
          for (let date = dayInLastWeek; date < currentDate; date.setDate(date.getDate() + 1)) {
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
            for(let j = 0; j < revenueByDate.length; j++)
              if(revenueByDate[j].date == formattedDateList[i])
                this.revenueInChart[i] = revenueByDate[j].total;
          for(let i = 0; i < formattedDateList.length; i++)
            for(let j = 0; j < spendingByDate.length; j++)
              if(spendingByDate[j].date == formattedDateList[i])
                this.costInChart[i] = spendingByDate[j].total;

          const formattedLabels = dateList.map(date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
          });
  
          this.labels = formattedLabels
          this.configureChart();
        })
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
